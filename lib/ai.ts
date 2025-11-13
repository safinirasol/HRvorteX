// Optional helper to call external AI services
export async function callAI(payload: any) {
  const aiUrl = process.env.AI_BACKEND_URL
  if (!aiUrl) throw new Error('AI backend URL not set')
  const res = await fetch(aiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  return res.json()
}
