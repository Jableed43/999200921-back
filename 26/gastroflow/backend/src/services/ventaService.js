import mongoose from 'mongoose'
import Venta from '../models/ventaModel.js'
import Producto from '../models/productoModel.js'
import Insumo from '../models/insumoModel.js'

/**
 * Detecta si el servidor MongoDB soporta transacciones.
 * 
 * CAUSA RAÍZ DEL BUG:
 * mongoose.startSession() y session.startTransaction() son operaciones
 * CLIENT-SIDE que NUNCA lanzan error, incluso en MongoDB standalone.
 * El error "Transaction numbers are only allowed on a replica set member
 * or mongos" explota recién cuando la primera query con metadatos de
 * sesión (LSID + txnNumber) llega al servidor. Por eso los try-catch
 * anteriores alrededor de startTransaction() no atrapaban nada.
 * 
 * SOLUCIÓN: Inspeccionar la topología del driver ANTES de crear sesiones.
 */
const supportsTransactions = () => {
    try {
        const topology = mongoose.connection.client?.topology?.description?.type
        return topology === 'ReplicaSetWithPrimary' || topology === 'Sharded'
    } catch {
        return false
    }
}

// ETAPA 1: Crear Comanda (Reserva de Stock)
export const createVentaService = async (items, mozoId) => {
    if (!items || items.length === 0) {
        const error = new Error('La comanda no tiene items')
        error.statusCode = 400
        throw error
    }

    const canTransact = supportsTransactions()
    let session = null

    if (canTransact) {
        session = await mongoose.startSession()
        session.startTransaction()
    }

    try {
        let total_ingresos = 0
        let total_costo = 0
        const ventaItems = []
        const reservasMap = {}

        for (const item of items) {
            const query = Producto.findOne({ _id: item.producto, activo: true })
                .populate('receta.insumo')
                .populate('insumo_directo')

            if (session) query.session(session)
            const producto = await query

            if (!producto) {
                throw new Error(`Producto no encontrado o inactivo: ${item.producto}`)
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

        // Validación de Stock
        for (const [insumo_id, cantidad] of Object.entries(reservasMap)) {
            const queryInsumo = Insumo.findById(insumo_id)
            if (session) queryInsumo.session(session)
            const insumo = await queryInsumo

            const stockDisponibleVenta = insumo.stock_actual - insumo.stock_reservado
            if (stockDisponibleVenta - cantidad < insumo.stock_minimo) {
                throw new Error(
                    `Stock insuficiente para "${insumo.nombre}".`
                )
            }
        }

        // Aplicar Reservas
        for (const [insumo_id, cantidad] of Object.entries(reservasMap)) {
            await Insumo.findByIdAndUpdate(
                insumo_id,
                { $inc: { stock_reservado: cantidad } },
                session ? { session } : {}
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

        await venta.save(session ? { session } : {})

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
    const canTransact = supportsTransactions()
    let session = null

    if (canTransact) {
        session = await mongoose.startSession()
        session.startTransaction()
    }

    try {
        const queryVenta = Venta.findById(ventaId).populate('items.producto')
        if (session) queryVenta.session(session)
        const venta = await queryVenta

        if (!venta) throw new Error('Comanda no encontrada')
        if (venta.estado !== 'PENDIENTE') throw new Error('Estado inválido')

        for (const item of venta.items) {
            const prodQuery = Producto.findById(item.producto)
                .populate('receta.insumo')
                .populate('insumo_directo')
            if (session) prodQuery.session(session)
            const producto = await prodQuery

            if (producto.tipo === 'directo') {
                await Insumo.findByIdAndUpdate(producto.insumo_directo._id, {
                    $inc: { stock_actual: -item.cantidad, stock_reservado: -item.cantidad }
                }, session ? { session } : {})
            } else {
                for (const recetaItem of producto.receta) {
                    const cantTotal = recetaItem.cantidad * item.cantidad
                    await Insumo.findByIdAndUpdate(recetaItem.insumo._id, {
                        $inc: { stock_actual: -cantTotal, stock_reservado: -cantTotal }
                    }, session ? { session } : {})
                }
            }
        }

        venta.estado = 'LISTO'
        venta.preparadoAt = new Date()
        await venta.save(session ? { session } : {})

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
    if (!venta || venta.estado !== 'LISTO') throw new Error('Operación no permitida')
    venta.estado = 'ENTREGADO'
    venta.entregadoAt = new Date()
    return await venta.save()
}

export const getAllVentaService = async (query = {}) => {
    let filters = {}
    if (query.estado) filters.estado = query.estado
    if (query.mozo) filters.mozo = query.mozo

    // Filtro por día: si viene ?today=true, solo traer las de hoy
    if (query.today === 'true') {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        filters.createdAt = { $gte: startOfDay }
    }

    return await Venta.find(filters).populate('mozo', 'nombre apellido').sort({ createdAt: -1 })
}
