import { db } from '../libs/prismadb'
import getCurrentUser from './getCurrentUser'

/* eslint-disable @typescript-eslint/no-explicit-any */
const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.email) {
      return null
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    })

    return conversation
  } catch (err: any) {
    return null
  }
}

export default getConversationById
