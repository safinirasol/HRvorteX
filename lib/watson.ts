// Optional Watson helper
export async function triggerWatson(payload: any) {
  const url = process.env.WATSON_URL
  const key = process.env.WATSON_API_KEY
  if (!url || !key) throw new Error('Watson not configured')
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` }, body: JSON.stringify(payload) })
  return res.json()
}
