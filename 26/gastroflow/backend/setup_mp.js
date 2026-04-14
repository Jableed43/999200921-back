import { MP_ACCESS_TOKEN } from './src/config/config.js'

const MP_API_BASE = 'https://api.mercadopago.com'

async function setup() {
    console.log("Creando Caja (POS)...")
    const posResponse = await fetch(`${MP_API_BASE}/pos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            name: "Caja 1",
            fixed_amount: true,
            store_id: 75889239,
            external_store_id: "STORE_1",
            external_id: "CAJA1"
        })
    })

    const pos = await posResponse.json()
    console.log("Caja creada:", pos)
}

setup().catch(console.error)
