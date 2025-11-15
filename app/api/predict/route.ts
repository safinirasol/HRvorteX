// api/predict/route.ts - Updated version
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Forward to Flask backend for prediction
    const flaskResponse = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    if (!flaskResponse.ok) {
      throw new Error('Flask backend error')
    }
    
    const result = await flaskResponse.json()

    // Your existing Watson & Hedera code here...
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    
    try {
      await fetch(`${baseUrl}/api/watson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: body.name, risk: result.risk, score: result.score })
      })
    } catch (e) {
      console.error('Watson API error:', e)
    }

    try {
      await fetch(`${baseUrl}/api/hedera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: body.name, risk: result.risk, score: result.score })
      })
    } catch (e) {
      console.error('Hedera API error:', e)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Predict API error:', error)
    return NextResponse.json(
      { error: 'Failed to process prediction' },
      { status: 500 }
    )
  }
}