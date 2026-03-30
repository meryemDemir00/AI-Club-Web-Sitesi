import { NextResponse } from 'next/server'
import { getEvents, addEvent } from '@/lib/data'

export async function GET() {
  try {
    const events = getEvents()
    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Etkinlikler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, date, time, location, mapQuery, type, capacity, isActive } = body

    if (!title || !description || !date || !time || !location || !type || !capacity) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const validTypes = ['workshop', 'seminar', 'hackathon', 'meetup']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Geçersiz etkinlik türü' }, { status: 400 })
    }

    const newEvent = addEvent({
      title,
      description,
      date,
      time,
      location,
      mapQuery: mapQuery || location,
      type,
      capacity: parseInt(capacity),
      isActive: isActive !== false
    })

    return NextResponse.json({ success: true, event: newEvent })
  } catch {
    return NextResponse.json({ error: 'Etkinlik eklenemedi' }, { status: 500 })
  }
}
