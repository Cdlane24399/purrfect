// Waitlist signup → Resend audience (provisioned via the Vercel Marketplace),
// plus a confirmation email. The email is best-effort: a send failure (e.g.
// domain not yet verified) never fails the signup itself.
const RESEND = 'https://api.resend.com'
const AUDIENCE_NAME = 'Felt & Fern Waitlist'
const FROM = 'Felt & Fern <info@feltfern.com>'

export const CONFIRM_SUBJECT = "You're on the list — Felt & Fern"
export const CONFIRM_HTML = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F3EC;font-family:Georgia,'Times New Roman',serif;color:#1A1510;">
    <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
      <img src="https://www.feltfern.com/email/felt-fern-mark.png" width="64" height="64" alt="" style="display:block;margin:0 auto 16px;border-radius:50%;" />
      <p style="text-align:center;font-size:28px;line-height:1;color:#1A1510;margin:0 0 34px;">Felt <span style="color:#C8B49A;">&amp;</span> Fern</p>
      <div style="background:#221912;border-radius:24px;padding:44px 36px;text-align:center;">
        <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#C8B49A;margin:0 0 18px;">Join the litter</p>
        <h1 style="font-weight:normal;font-size:30px;line-height:1.15;color:#F7F3EC;margin:0 0 18px;">You&rsquo;re on the list.</h1>
        <p style="font-size:15px;line-height:1.6;color:#D8CFC2;margin:0;">
          Our debut collection — a toy, a scratcher, a hideaway and a treat, all made from
          natural materials — is in production now. You&rsquo;ll be the first to hear when it
          launches, with early access and a member-only welcome offer.
        </p>
      </div>
      <p style="text-align:center;font-size:12px;line-height:1.6;color:#8a7f72;margin:28px 0 0;">
        You joined the waitlist at feltfern.com.<br/>
        Only launch updates — no spam. Reply to this email any time to be removed.
      </p>
    </div>
  </body>
</html>`

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
  } catch (err) {
    console.error(err)
    return res.status(502).json({ error: 'Signup failed' })
  }

  try {
    await resend(key, '/emails', {
      method: 'POST',
      body: JSON.stringify({
        from: FROM,
        to: [email],
        reply_to: 'info@feltfern.com',
        subject: CONFIRM_SUBJECT,
        html: CONFIRM_HTML,
      }),
    })
  } catch (err) {
    console.error('confirmation email failed:', err)
  }

  return res.status(200).json({ ok: true })
}
