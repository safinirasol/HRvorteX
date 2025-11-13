// Hedera helper (optional)
import { Client, TopicMessageSubmitTransaction } from '@hashgraph/sdk'

export async function submitHederaMessage(accountId: string, privateKey: string, topicId: string, message: string) {
  const client = Client.forTestnet()
  client.setOperator(accountId, privateKey)
  const tx = await new TopicMessageSubmitTransaction().setTopicId(topicId).setMessage(message).execute(client)
  const receipt = await tx.getReceipt(client)
  return receipt
}
