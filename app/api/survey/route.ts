// api/survey/route.ts - Updated version
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Forward to Flask backend
    const flaskResponse = await fetch('http://localhost:5000/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (!flaskResponse.ok) {
      throw new Error('Flask backend error')
    }
    
    const result = await flaskResponse.json()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Survey API error:', error)
    return NextResponse.json(
      { error: 'Failed to submit survey' },
      { status: 500 }
    )
  }
}