import { checkModelExist } from '../helpers/checkExist.js'
import Insumo from '../models/insumoModel.js'

export const createInsumoService = async (data) => {
    const { nombre } = data
    await checkModelExist(Insumo, { nombre }, false, 400, `El insumo "${nombre}" ya existe`)

    const insumo = new Insumo(data)
    return await insumo.save()
}

export const getAllInsumoService = async (query) => {
    let filters = {}

    // Filtrar solo los que están en alerta de stock bajo
    if (query.alerta === 'true') {
        filters.$expr = { $lte: ['$stock_actual', '$stock_minimo'] }
    }

    // Búsqueda parcial por nombre
    if (query.search) {
        filters.nombre = { $regex: query.search, $options: 'i' }
    }

    return await Insumo.find(filters).sort({ nombre: 1 })
}

export const getInsumoByIdService = async (id) => {
    return await checkModelExist(Insumo, { _id: id }, true, 404, 'Insumo no encontrado')
}

export const updateInsumoService = async (id, data) => {
    await checkModelExist(Insumo, { _id: id }, true, 404, 'Insumo no encontrado')

    return await Insumo.findOneAndUpdate(
        { _id: id },
        data,
        { returnDocument: 'after', runValidators: true }
    )
}

export const deleteInsumoService = async (id) => {
    await checkModelExist(Insumo, { _id: id }, true, 404, 'Insumo no encontrado')

    const deleted = await Insumo.findByIdAndDelete(id)
    return { message: 'Insumo eliminado correctamente', data: deleted }
}
