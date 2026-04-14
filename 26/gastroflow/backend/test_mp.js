import { MP_ACCESS_TOKEN } from './src/config/config.js'
import { v4 as uuidv4 } from 'uuid'
import assert from 'assert'

const MP_API_BASE = 'https://api.mercadopago.com'

async function tryCreateOrder() {
    const totalAmount = "500.00"
    const idempotencyKey = uuidv4()

    const body = {
        type: 'qr',
        total_amount: totalAmount,
        description: `Comanda de prueba`,
        external_reference: "12345",
        expiration_time: 'PT30M',
        config: {
            qr: {
                external_pos_id: 'CAJA1', // of local
                mode: 'dynamic'
            }
        },
        transactions: {
            payments: [
                {
                    amount: totalAmount
                }
            ]
        },
        items: [
            {
                title: 'Producto Loco',
                unit_price: totalAmount,
                quantity: 1,
                unit_measure: 'unit',
                external_code: 'item_1'
            }
        ]
    }

    console.log("Token is:", MP_ACCESS_TOKEN.substring(0, 10))

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
    console.log("Status:", response.status)
    console.log("Data:", JSON.stringify(data, null, 2))
}

tryCreateOrder().catch(console.error)
