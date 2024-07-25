/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getConversations = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser?.id) {
    return []
  }

  try {
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser?.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    })

    return conversations
  } catch (err: any) {
    return []
  }
}

export default getConversations
