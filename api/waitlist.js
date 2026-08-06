// Waitlist signup → Resend audience (provisioned via the Vercel Marketplace).
const RESEND = 'https://api.resend.com'
const AUDIENCE_NAME = 'Felt & Fern Waitlist'

let audienceId // cached per warm instance

async function resend(key, path, init = {}) {
  const res = await fetch(`${RESEND}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  if (!res.ok) throw new Error(`Resend ${path} → ${res.status}`)
  return res.json()
}

async function getAudienceId(key) {
  if (audienceId) return audienceId
  const { data } = await resend(key, '/audiences')
  const existing = data?.find((a) => a.name === AUDIENCE_NAME)
  if (existing) return (audienceId = existing.id)
  const created = await resend(key, '/audiences', {
    method: 'POST',
    body: JSON.stringify({ name: AUDIENCE_NAME }),
  })
  return (audienceId = created.id)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const email = String(req.body?.email ?? '').trim()
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) return res.status(503).json({ error: 'Waitlist not configured yet' })

  try {
    const id = await getAudienceId(key)
    await resend(key, `/audiences/${id}/contacts`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(502).json({ error: 'Signup failed' })
  }
}
