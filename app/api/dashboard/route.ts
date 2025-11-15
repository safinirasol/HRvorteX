import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Forward request to Flask backend
    const flaskResponse = await fetch('http://localhost:5000/api/dashboard', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!flaskResponse.ok) {
      console.error('Flask dashboard error:', flaskResponse.status)
      throw new Error('Flask backend error')
    }
    
    const data = await flaskResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}