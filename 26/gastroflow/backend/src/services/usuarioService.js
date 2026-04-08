import bcrypt from 'bcrypt'
import { checkModelExist } from '../helpers/checkExist.js'
import Usuario from '../models/usuarioModel.js'

export const createUsuarioService = async (data) => {
    const { email } = data
    await checkModelExist(Usuario, { email }, false, 400, `El email "${email}" ya está registrado`)

    const usuario = new Usuario(data)
    return await usuario.save()
}

export const loginUsuarioService = async ({ email, password }) => {
    // Verificamos que el usuario exista
    const usuario = await checkModelExist(Usuario, { email, activo: true }, true, 401, 'Credenciales inválidas')

    // Comparamos la contraseña ingresada con el hash guardado
    const passwordValida = bcrypt.compareSync(password, usuario.password)
    if (!passwordValida) {
        const error = new Error('Credenciales inválidas')
        error.statusCode = 401
        throw error
    }

    return usuario
}

export const getAllUsuarioService = async () => {
    return await Usuario.find({ activo: true }).select('-password').sort({ apellido: 1 })
}

export const getUsuarioByIdService = async (id) => {
    const usuario = await Usuario.findOne({ _id: id, activo: true }).select('-password')
    if (!usuario) {
        const error = new Error('Usuario no encontrado')
        error.statusCode = 404
        throw error
    }
    return usuario
}

export const updateUsuarioService = async (id, data) => {
    await checkModelExist(Usuario, { _id: id }, true, 404, 'Usuario no encontrado')

    // Evitar que se actualice el password directo por esta ruta (sin pasar por el hook)
    delete data.password

    return await Usuario.findOneAndUpdate(
        { _id: id },
        data,
        { returnDocument: 'after', runValidators: true }
    ).select('-password')
}

export const deleteUsuarioService = async (id) => {
    await checkModelExist(Usuario, { _id: id }, true, 404, 'Usuario no encontrado')

    // Soft delete
    await Usuario.findByIdAndUpdate(id, { activo: false })
    return { message: 'Usuario desactivado correctamente' }
}
