import { db } from '../libs/prismadb'

/* eslint-disable @typescript-eslint/no-explicit-any */
const getMessages = async (conversationId: string) => {
  try {
    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return messages
  } catch (err: any) {
    return []
  }
}

export default getMessages
