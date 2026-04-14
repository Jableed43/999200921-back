import { MP_ACCESS_TOKEN } from './src/config/config.js'

const MP_API_BASE = 'https://api.mercadopago.com'

async function createTestPayer() {
    const response = await fetch(`${MP_API_BASE}/users/test_user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            site_id: "MLA"
        })
    })

    const data = await response.json()
    console.log("Test User:", JSON.stringify(data, null, 2))
}

createTestPayer().catch(console.error)
