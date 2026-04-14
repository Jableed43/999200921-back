import { MP_ACCESS_TOKEN } from '../config/config.js'
import { v4 as uuidv4 } from 'uuid'

const MP_API_BASE = 'https://api.mercadopago.com'

/**
 * Crea una orden QR en Mercado Pago a partir de una venta de GastroFlow.
 * Retorna el qr_data para generar el código QR en el frontend.
 * 
 * @param {Object} venta - Documento de venta de MongoDB
 * @returns {Object} { orderId, qrData, status }
 */
export const crearOrdenMP = async (venta) => {
    const idempotencyKey = uuidv4()

    // Construir items para MP a partir de los items de la venta
    const items = venta.items.map(item => ({
        title: item.nombre_producto,
        unit_price: item.precio_unitario.toFixed(2),
        quantity: item.cantidad,
        unit_measure: 'unit',
        external_code: item.producto.toString()
    }))

    // Monto total (suma de precio_unitario * cantidad de cada item)
    const totalAmount = venta.total_ingresos.toFixed(2)

    // Monto del payment (igual al total)
    const paymentAmount = totalAmount

    const body = {
        type: 'qr',
        total_amount: totalAmount,
        description: `Comanda GastroFlow #${venta._id.toString().slice(-4).toUpperCase()}`,
        external_reference: venta._id.toString(),
        expiration_time: 'PT30M', // 30 minutos para pagar
        config: {
            qr: {
                external_pos_id: 'CAJA1',
                mode: 'dynamic'
            }
        },
        transactions: {
            payments: [
                {
                    amount: paymentAmount
                }
            ]
        },
        items
    }

    const response = await fetch(`${MP_API_BASE}/v1/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
            'X-Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('❌ Error Mercado Pago:', JSON.stringify(data, null, 2))
        const error = new Error(data.message || `Error de Mercado Pago (${response.status})`)
        error.statusCode = response.status
        error.mpError = data
        throw error
    }

    return {
        orderId: data.id,
        qrData: data.type_response?.qr_data || null,
        status: data.status,
        raw: data
    }
}

/**
 * Consulta el estado de una orden en Mercado Pago.
 * @param {string} orderId - ID de la orden MP (ORD...)
 */
export const consultarOrdenMP = async (orderId) => {
    const response = await fetch(`${MP_API_BASE}/v1/orders/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Error consultando orden MP: ${response.status}`)
    }

    return {
        orderId: data.id,
        status: data.status,
        statusDetail: data.status_detail,
        payments: data.transactions?.payments || [],
        raw: data
    }
}
