import { MP_ACCESS_TOKEN } from './src/config/config.js'

const MP_API_BASE = 'https://api.mercadopago.com'

async function listStores() {
    const response = await fetch(`${MP_API_BASE}/users/3333936459/stores/search`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
    })
    const data = await response.json()
    console.log("Stores:", JSON.stringify(data, null, 2))
}

listStores().catch(console.error)
