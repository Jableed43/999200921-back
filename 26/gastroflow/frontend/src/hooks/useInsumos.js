import { useState, useCallback } from 'react'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useInsumos = () => {
    const [insumos, setInsumos] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchInsumos = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/insumo')
            setInsumos(res.data)
        } catch (err) {
            Swal.fire('Error', 'No se pudieron cargar los insumos', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    const saveInsumo = async (data, id = null) => {
        try {
            if (id) {
                await api.patch(`/insumo/${id}`, data)
                Swal.fire({ title: 'Actualizado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
            } else {
                await api.post('/insumo', data)
                Swal.fire({ title: 'Creado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
            }
            fetchInsumos()
            return true
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al guardar', 'error')
            return false
        }
    }

    const deleteInsumo = async (id) => {
        const result = await Swal.fire({
            title: '¿Confirmar eliminación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff9800',
            confirmButtonText: 'Sí, eliminar'
        })

        if (result.isConfirmed) {
            try {
                await api.delete(`/insumo/${id}`)
                Swal.fire('Eliminado', '', 'success')
                fetchInsumos()
                return true
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar', 'error')
                return false
            }
        }
        return false
    }

    return { insumos, loading, fetchInsumos, saveInsumo, deleteInsumo }
}
