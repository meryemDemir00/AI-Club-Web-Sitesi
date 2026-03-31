import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateAdmin } from '@/lib/mysql-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanici adi ve sifre zorunlu' },
        { status: 400 }
      )
    }

    const isValid = await validateAdmin(username, password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Gecersiz giris bilgileri' },
        { status: 401 }
      )
    }

    // Set a simple session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Giris yapilamadi' },
      { status: 500 }
    )
  }
}
