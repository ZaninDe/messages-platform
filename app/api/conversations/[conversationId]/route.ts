import getCurrentUser from '@/app/actions/getCurrentUser'
import { db } from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IParams {
  conversationId?: string
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  try {
    const { conversationId } = params
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    })

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 })
    }

    const deletedConversation = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    })

    return NextResponse.json(deletedConversation)
  } catch (err: any) {
    console.log(err, 'ERROR_CONVERSATION_DELETE')
    return new NextResponse('Internal Error', { status: 500 })
  }
}