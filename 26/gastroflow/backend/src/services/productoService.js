import { checkModelExist } from '../helpers/checkExist.js'
import Producto from '../models/productoModel.js'
import Insumo from '../models/insumoModel.js'

// Función interna: calcula costo y disponibilidad de un producto ya populado
// REGLA DE NEGOCIO: Un producto está disponible solo si el stock neto resultante 
// (Físico - Reservado - Pedido) es MAYOR al Stock Mínimo.
const calcularInfo = (producto) => {
    let costo = 0
    let disponible = true

    if (producto.tipo === 'directo') {
        const insumo = producto.insumo_directo
        // Regla: stock_actual - stock_reservado - 1 (unidad pedida) >= stock_minimo
        if (!insumo || (insumo.stock_actual - insumo.stock_reservado) <= insumo.stock_minimo) {
            disponible = false
        }
        costo = insumo ? insumo.costo_unitario : 0
    } else {
        for (const item of producto.receta) {
            const insumo = item.insumo
            // Regla: stock_neto - cantidad_receta >= stock_minimo
            const stockNeto = insumo ? (insumo.stock_actual - insumo.stock_reservado) : 0
            if (!insumo || (stockNeto - item.cantidad) < insumo.stock_minimo) {
                disponible = false
            }
            costo += insumo ? insumo.costo_unitario * item.cantidad : 0
        }
    }

    return {
        costo_calculado: parseFloat(costo.toFixed(2)),
        margen_calculado: parseFloat((producto.precio_venta - costo).toFixed(2)),
        disponible,
    }
}

export const getAllProductoService = async (query) => {
    let filters = { activo: true }

    if (query.search) {
        filters.nombre = { $regex: query.search, $options: 'i' }
    }
    if (query.tipo) {
        filters.tipo = query.tipo
    }

    const productos = await Producto.find(filters)
        .populate('receta.insumo', 'nombre unidad stock_actual stock_reservado stock_minimo costo_unitario')
        .populate('insumo_directo', 'nombre unidad stock_actual stock_reservado stock_minimo costo_unitario')

    return productos.map(p => ({ ...p.toJSON(), ...calcularInfo(p) }))
}

export const getProductoByIdService = async (id) => {
    const producto = await Producto.findOne({ _id: id, activo: true })
        .populate('receta.insumo', 'nombre unidad stock_actual stock_reservado stock_minimo costo_unitario')
        .populate('insumo_directo', 'nombre unidad stock_actual stock_reservado stock_minimo costo_unitario')

    if (!producto) {
        const error = new Error('Producto no encontrado')
        error.statusCode = 404
        throw error
    }

    return { ...producto.toJSON(), ...calcularInfo(producto) }
}

export const createProductoService = async (data) => {
    const { nombre } = data
    await checkModelExist(Producto, { nombre }, false, 400, `El producto "${nombre}" ya existe`)

    const producto = new Producto(data)
    return await producto.save()
}

export const updateProductoService = async (id, data) => {
    await checkModelExist(Producto, { _id: id }, true, 404, 'Producto no encontrado')

    return await Producto.findOneAndUpdate(
        { _id: id },
        data,
        { returnDocument: 'after', runValidators: true }
    )
}

export const deleteProductoService = async (id) => {
    await checkModelExist(Producto, { _id: id }, true, 404, 'Producto no encontrado')

    const updated = await Producto.findOneAndUpdate(
        { _id: id },
        { activo: false },
        { returnDocument: 'after' }
    )
    return { message: 'Producto desactivado correctamente', data: updated }
}
