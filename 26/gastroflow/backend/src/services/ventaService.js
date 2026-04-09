import mongoose from 'mongoose'
import Venta from '../models/ventaModel.js'
import Producto from '../models/productoModel.js'
import Insumo from '../models/insumoModel.js'

// ETAPA 1: Crear Comanda (Reserva de Stock)
export const createVentaService = async (items, mozoId) => {
    if (!items || items.length === 0) {
        const error = new Error('La comanda no tiene items')
        error.statusCode = 400
        throw error
    }

    // Intentar iniciar sesión (requiere Replica Set). Si falla, procedemos sin transacción para desarrollo local.
    let session = null
    try {
        session = await mongoose.startSession()
        if (session) session.startTransaction()
    } catch (e) {
        console.warn('⚠️ MongoDB standalone detectado. Las transacciones están desactivadas.')
        session = null
    }

    try {
        let total_ingresos = 0
        let total_costo = 0
        const ventaItems = []
        const reservasMap = {}

        for (const item of items) {
            const producto = await Producto.findOne({ _id: item.producto_id, activo: true })
                .populate('receta.insumo')
                .populate('insumo_directo')
                .session(session)

            if (!producto) {
                throw new Error(`Producto no encontrado o inactivo: ${item.producto_id}`)
            }

            let costo_unitario = 0

            if (producto.tipo === 'directo') {
                const insumo = producto.insumo_directo
                const key = insumo._id.toString()
                reservasMap[key] = (reservasMap[key] || 0) + (1 * item.cantidad)
                costo_unitario = insumo.costo_unitario
            } else {
                for (const recetaItem of producto.receta) {
                    const insumo = recetaItem.insumo
                    const key = insumo._id.toString()
                    const cantTotal = recetaItem.cantidad * item.cantidad
                    reservasMap[key] = (reservasMap[key] || 0) + cantTotal
                    costo_unitario += insumo.costo_unitario * recetaItem.cantidad
                }
            }

            total_ingresos += producto.precio_venta * item.cantidad
            total_costo += costo_unitario * item.cantidad

            ventaItems.push({
                producto: producto._id,
                nombre_producto: producto.nombre,
                cantidad: item.cantidad,
                precio_unitario: producto.precio_venta,
                costo_unitario: parseFloat(costo_unitario.toFixed(2)),
                notas: item.notas || '',
            })
        }

        for (const [insumo_id, cantidad] of Object.entries(reservasMap)) {
            const insumo = await Insumo.findById(insumo_id).session(session)
            const stockDisponibleVenta = insumo.stock_actual - insumo.stock_reservado
            
            if (stockDisponibleVenta - cantidad < insumo.stock_minimo) {
                throw new Error(
                    `Bloqueo por Stock Mínimo: "${insumo.nombre}" llegaría al límite de seguridad. Disponible: ${stockDisponibleVenta}, Requerido: ${cantidad}, Mínimo: ${insumo.stock_minimo}`
                )
            }
        }

        for (const [insumo_id, cantidad] of Object.entries(reservasMap)) {
            await Insumo.findByIdAndUpdate(
                insumo_id,
                { $inc: { stock_reservado: cantidad } },
                { session }
            )
        }

        const venta = new Venta({
            items: ventaItems,
            mozo: mozoId,
            estado: 'PENDIENTE',
            total_ingresos: parseFloat(total_ingresos.toFixed(2)),
            total_costo: parseFloat(total_costo.toFixed(2)),
            margen: parseFloat((total_ingresos - total_costo).toFixed(2)),
        })
        await venta.save({ session })

        if (session) {
            await session.commitTransaction()
            session.endSession()
        }
        return venta

    } catch (error) {
        if (session) {
            await session.abortTransaction()
            session.endSession()
        }
        throw error
    }
}

// ETAPA 2: Procesar Pedido (Deducción Física)
export const prepararPedidoService = async (ventaId) => {
    let session = null
    try {
        session = await mongoose.startSession()
        if (session) session.startTransaction()
    } catch (e) {
        session = null
    }

    try {
        const venta = await Venta.findById(ventaId).populate('items.producto').session(session)
        if (!venta) {
            const error = new Error('Comanda no encontrada')
            error.statusCode = 404
            throw error
        }
        if (venta.estado !== 'PENDIENTE') throw new Error(`La comanda no está pendiente (Estado actual: ${venta.estado})`)

        for (const item of venta.items) {
            const producto = await Producto.findById(item.producto).populate('receta.insumo').populate('insumo_directo').session(session)
            
            if (producto.tipo === 'directo') {
                const insumoId = producto.insumo_directo._id
                await Insumo.findByIdAndUpdate(insumoId, {
                    $inc: { stock_actual: -item.cantidad, stock_reservado: -item.cantidad }
                }, { session })
            } else {
                for (const recetaItem of producto.receta) {
                    const cantTotal = recetaItem.cantidad * item.cantidad
                    await Insumo.findByIdAndUpdate(recetaItem.insumo._id, {
                        $inc: { stock_actual: -cantTotal, stock_reservado: -cantTotal }
                    }, { session })
                }
            }
        }

        venta.estado = 'LISTO'
        venta.preparadoAt = new Date()
        await venta.save({ session })

        if (session) {
            await session.commitTransaction()
            session.endSession()
        }
        return venta
    } catch (error) {
        if (session) {
            await session.abortTransaction()
            session.endSession()
        }
        throw error
    }
}

// ETAPA 3: Entrega Final
export const entregarPedidoService = async (ventaId) => {
    const venta = await Venta.findById(ventaId)
    if (!venta) {
        const error = new Error('Comanda no encontrada')
        error.statusCode = 404
        throw error
    }
    if (venta.estado !== 'LISTO') throw new Error('Solo se pueden entregar pedidos que estén listos')

    venta.estado = 'ENTREGADO'
    venta.entregadoAt = new Date()
    return await venta.save()
}

export const getAllVentaService = async (query = {}) => {
    let filters = {}
    if (query.estado) filters.estado = query.estado
    if (query.mozo) filters.mozo = query.mozo

    return await Venta.find(filters)
        .populate('mozo', 'nombre apellido')
        .sort({ createdAt: -1 })
}
