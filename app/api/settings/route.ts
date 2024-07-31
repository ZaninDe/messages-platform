/* eslint-disable @typescript-eslint/no-explicit-any */
import getCurrentUser from '@/app/actions/getCurrentUser'
import { db } from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json()
    const { name, image } = body

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const updatedUser = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (err: any) {
    console.log(err, 'ERROR_SETTINGS')
    return new NextResponse('Internal Error', { status: 500 })
  }
}
