import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/app/libs/prismadb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email || !name || !password) {
      return new NextResponse('Missing info', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    })

    return NextResponse.json(user)
  } catch (err) {
    console.log(err, 'REGISTRATION_ERROR')
    return new NextResponse('internal server error', { status: 500 })
  }
}
