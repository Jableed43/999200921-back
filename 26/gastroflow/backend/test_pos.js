import { MP_ACCESS_TOKEN } from './src/config/config.js'
import assert from 'assert'

const MP_API_BASE = 'https://api.mercadopago.com'

async function listPOS() {
    const response = await fetch(`${MP_API_BASE}/pos?external_id=EXTERNALPOS019285`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
    })

    const data = await response.json()
    console.log("Status:", response.status)
    console.log("Data:", JSON.stringify(data, null, 2))
}
async function listAll() {
    const response = await fetch(`${MP_API_BASE}/pos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
    })

    const data = await response.json()
    console.log("Status:", response.status)
    console.log("Data:", JSON.stringify(data, null, 2))
}

listAll().catch(console.error)
