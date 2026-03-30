import { NextResponse } from 'next/server'
import { getMessages, markMessageAsRead, deleteMessage } from '@/lib/data'

export async function GET() {
  try {
    const messages = getMessages()
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json(
      { error: 'Mesajlar alinamadi' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID zorunlu' },
        { status: 400 }
      )
    }

    const success = markMessageAsRead(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Mesaj bulunamadi' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Mesaj guncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID zorunlu' },
        { status: 400 }
      )
    }

    const deleted = deleteMessage(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Mesaj bulunamadi' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Mesaj silinemedi' },
      { status: 500 }
    )
  }
}
