import { NextResponse } from 'next/server'
import { Client, TopicMessageSubmitTransaction } from '@hashgraph/sdk'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, risk, score } = body

  const accountId = process.env.HEDERA_ACCOUNT_ID
  const privateKey = process.env.HEDERA_PRIVATE_KEY
  const topicId = process.env.HEDERA_TOPIC_ID

  if (!accountId || !privateKey || !topicId) {
    console.log('Hedera not configured; skipping on-chain log.')
    return NextResponse.json({ status: 'hedera_skipped' })
  }

  try {
    const client = Client.forTestnet()
    client.setOperator(accountId, privateKey)
    const message = JSON.stringify({ event: 'score_computed', name, risk, score, ts: new Date().toISOString() })
    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client)
    const receipt = await tx.getReceipt(client)
    return NextResponse.json({ status: 'submitted', receipt })
  } catch (e) {
    console.error('hedera error', e)
    return NextResponse.json({ status: 'hedera_error', error: String(e) })
  }
}
