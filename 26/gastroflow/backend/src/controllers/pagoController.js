import Venta from '../models/ventaModel.js'
import { crearOrdenMP, consultarOrdenMP } from '../services/mercadoPagoService.js'
import { handleError } from '../utils/errorHandler.js'

/**
 * POST /api/pagos/:ventaId/qr
 * Genera una orden QR de Mercado Pago para una venta existente.
 */
export const generarQR = async (req, res) => {
    try {
        const { ventaId } = req.params
        const venta = await Venta.findById(ventaId)

        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' })
        }

        // Si ya tiene una orden MP, retornarla
        if (venta.mp_order_id && venta.mp_qr_data) {
            return res.status(200).json({
                message: 'Orden QR existente',
                orderId: venta.mp_order_id,
                qrData: venta.mp_qr_data,
                total: venta.total_ingresos
            })
        }

        const result = await crearOrdenMP(venta)

        // Guardar referencia de MP en la venta
        venta.mp_order_id = result.orderId
        venta.mp_qr_data = result.qrData
        venta.mp_status = result.status
        await venta.save()

        res.status(201).json({
            message: 'QR generado exitosamente',
            orderId: result.orderId,
            qrData: result.qrData,
            total: venta.total_ingresos
        })
    } catch (error) {
        handleError(error, res)
    }
}

/**
 * GET /api/pagos/:ventaId/status
 * Consulta el estado del pago de una venta en Mercado Pago.
 */
export const consultarEstadoPago = async (req, res) => {
    try {
        const { ventaId } = req.params
        const venta = await Venta.findById(ventaId)

        if (!venta || !venta.mp_order_id) {
            return res.status(404).json({ message: 'No hay orden de pago asociada' })
        }

        const result = await consultarOrdenMP(venta.mp_order_id)

        // Actualizar estado local
        venta.mp_status = result.status
        await venta.save()

        res.status(200).json({
            orderId: result.orderId,
            status: result.status,
            statusDetail: result.statusDetail,
            payments: result.payments
        })
    } catch (error) {
        handleError(error, res)
    }
}
