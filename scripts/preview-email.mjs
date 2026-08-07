// Live preview of the waitlist confirmation email: node scripts/preview-email.mjs
// Re-imports api/waitlist.js on every request, so edits show on browser refresh.
import { createServer } from 'node:http'

const PORT = 4400

createServer(async (req, res) => {
  const { CONFIRM_HTML } = await import(
    new URL(`../api/waitlist.js?t=${Date.now()}`, import.meta.url)
  )
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(CONFIRM_HTML)
}).listen(PORT, () => console.log(`email preview → http://localhost:${PORT}`))
