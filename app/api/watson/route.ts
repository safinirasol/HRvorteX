import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, risk, score } = body

  // Only trigger for high risk in this starter
  if (risk === 'High') {
    const watsonUrl = process.env.WATSON_URL
    const watsonKey = process.env.WATSON_API_KEY
    if (watsonUrl && watsonKey) {
      try {
        await fetch(watsonUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${watsonKey}`
          },
          body: JSON.stringify({
            action: 'notify_hr',
            subject: `Burnout Alert: ${name}`,
            message: `${name} scored ${score} (High). Please follow up.`
          })
        })
        return NextResponse.json({ status: 'watson_triggered' })
      } catch (e) {
        console.error('watson error', e)
        return NextResponse.json({ status: 'watson_failed', error: String(e) })
      }
    } else {
      // Watson not configured; simulate
      console.log('Watson not configured; simulated trigger for', name)
      return NextResponse.json({ status: 'watson_simulated' })
    }
  }

  return NextResponse.json({ status: 'no_action' })
}
