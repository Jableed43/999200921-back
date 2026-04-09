import { useState, useCallback } from 'react'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useProductos = () => {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchProductos = useCallback(async (filters = {}) => {
        setLoading(true)
        try {
            const res = await api.get('/producto', { params: filters })
            setProductos(res.data)
        } catch (err) {
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    const saveProducto = async (data, id = null) => {
        try {
            if (id) {
                await api.patch(`/producto/${id}`, data)
                Swal.fire({ title: 'Actualizado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
            } else {
                await api.post('/producto', data)
                Swal.fire({ title: 'Creado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
            }
            fetchProductos()
            return true
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al guardar', 'error')
            return false
        }
    }

    const deleteProducto = async (id) => {
        const result = await Swal.fire({
            title: '¿Confirmar eliminación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff9800',
            confirmButtonText: 'Sí, eliminar'
        })
        if (result.isConfirmed) {
            try {
                await api.delete(`/producto/${id}`)
                Swal.fire('Eliminado', '', 'success')
                fetchProductos()
                return true
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar', 'error')
                return false
            }
        }
        return false
    }

    return { productos, loading, fetchProductos, saveProducto, deleteProducto }
}
