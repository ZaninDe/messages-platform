import getCurrentUser from '@/app/actions/getCurrentUser'
import { db } from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IParams {
  conversationId?: string
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser()
    const { conversationId } = params

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // find the existing conversation
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    })

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 })
    }

    // find the last message
    const lastMessage = conversation?.messages[conversation.messages.length - 1]

    if (!lastMessage) {
      return NextResponse.json(conversation)
    }

    // update seen of last message
    const updatedMessage = await db.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    })

    return NextResponse.json(updatedMessage)
  } catch (err: any) {
    console.log(err, 'ERROR_MESSAGE_SEEN')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
