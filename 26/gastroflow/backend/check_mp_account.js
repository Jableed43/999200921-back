import { MP_ACCESS_TOKEN } from './src/config/config.js'

const MP_API_BASE = 'https://api.mercadopago.com'

async function checkAccount() {
    console.log("Checking MP Account info...")
    const response = await fetch(`${MP_API_BASE}/users/me`, {
        headers: {
            'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
        }
    })

    const data = await response.json()
    console.log("Status:", response.status)
    console.log("Data:", JSON.stringify({
        id: data.id,
        site_id: data.site_id,
        email: data.email,
        kyc: data.kyc_status,
        status: data.status
    }, null, 2))
}

checkAccount().catch(console.error)
