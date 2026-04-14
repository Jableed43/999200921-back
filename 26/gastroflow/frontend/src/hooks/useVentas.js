import { useState, useCallback } from 'react'
import api from '../services/api'
import Swal from 'sweetalert2'

export const useVentas = () => {
    const [ventas, setVentas] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchVentas = useCallback(async (filters = {}) => {
        setLoading(true)
        try {
            const res = await api.get('/venta', { params: filters })
            setVentas(res.data)
        } catch (err) {
            console.error('Error fetching ventas', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const crearVenta = async (items) => {
        try {
            const res = await api.post('/venta', { items })
            return res.data.venta // Retorna el objeto venta completo (incluye _id)
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al enviar pedido', 'error')
            return null
        }
    }

    const generarQR = async (ventaId) => {
        try {
            const res = await api.post(`/pagos/${ventaId}/qr`)
            return res.data // { orderId, qrData, total }
        } catch (err) {
            console.error('Error generando QR:', err)
            Swal.fire('Error', 'No se pudo generar el código QR de pago', 'error')
            return null
        }
    }

    const consultarPago = async (ventaId) => {
        try {
            const res = await api.get(`/pagos/${ventaId}/status`)
            return res.data
        } catch (err) {
            return null
        }
    }

    const marcarComoListo = async (id) => {
        try {
            await api.patch(`/venta/${id}/listo`)
            Swal.fire({ title: '¡Hecho!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
            return true
        } catch (err) {
            Swal.fire('Error', 'No se pudo procesar el pedido', 'error')
            return false
        }
    }

    const entregarPedido = async (id) => {
        try {
            await api.patch(`/venta/${id}/entregar`)
            Swal.fire('Entregado', '', 'success')
            fetchVentas()
            return true
        } catch (err) {
            Swal.fire('Error', 'No se pudo registrar la entrega', 'error')
            return false
        }
    }

    return { ventas, loading, fetchVentas, crearVenta, generarQR, consultarPago, marcarComoListo, entregarPedido }
}
