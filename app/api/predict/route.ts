import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  // If an external AI backend is configured, forward request there.
  const aiUrl = process.env.AI_BACKEND_URL
  let result: any
  if (aiUrl) {
    try {
      const r = await fetch(aiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      result = await r.json()
    } catch (e) {
      result = { risk: 'Unknown', score: 0, error: 'AI backend error' }
    }
  } else {
    // Simple rule-based mock
    const hours = Number(body.work_hours) || 40
    const stress = Number(body.stress) || 5
    const score = Math.round((hours / 40) * 50 + (stress / 10) * 50)
    const risk = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'
    result = { risk, score }
  }

  // Trigger Watson & Hedera asynchronously (fire-and-forget)
  try {
    await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/watson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: body.name, risk: result.risk, score: result.score })
    })
    await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/hedera`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: body.name, risk: result.risk, score: result.score })
    })
  } catch (e) {
    // non-blocking
    console.error('post processing error', e)
  }

  return NextResponse.json(result)
}
