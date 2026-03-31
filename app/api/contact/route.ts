import { NextResponse } from 'next/server'
import { addMessage } from '@/lib/mysql-store'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Ad, e-posta ve mesaj zorunludur' }, { status: 400 })
    }

    const newMessage = await addMessage({
      name,
      email,
      subject: subject || 'Genel',
      message
    })

    // Send email (non-blocking - don't fail the request if email fails)
    sendContactEmail({
      senderName: name,
      senderEmail: email,
      subject: subject || 'Genel',
      message
    }).catch(err => console.error('Email gönderme hatası:', err))

    return NextResponse.json({ success: true, message: newMessage })
  } catch {
    return NextResponse.json({ error: 'Mesaj kaydedilemedi' }, { status: 500 })
  }
}
