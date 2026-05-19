const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || ''
const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status}`)
  }

  const data = await res.json()
  return data.access_token
}

export async function createPayPalOrder(amountEur: string, description: string, customId: string): Promise<{ id: string; approveUrl: string }> {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'EUR', value: amountEur },
        description,
        custom_id: customId, // we store our metadata here
      }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal create order failed: ${err}`)
  }

  const order = await res.json()
  const approveLink = order.links?.find((l: { rel: string; href: string }) => l.rel === 'approve')

  return { id: order.id, approveUrl: approveLink?.href || '' }
}

export async function capturePayPalOrder(orderId: string): Promise<{
  status: string
  captureId: string
  customId: string
  amountValue: string
}> {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal capture failed: ${err}`)
  }

  const data = await res.json()
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  const customId = data.purchase_units?.[0]?.custom_id || ''

  return {
    status: data.status,
    captureId: capture?.id || orderId,
    customId,
    amountValue: capture?.amount?.value || '0',
  }
}
