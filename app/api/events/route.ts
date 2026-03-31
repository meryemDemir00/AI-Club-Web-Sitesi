import { NextResponse } from 'next/server'
import { addEvent, getEvents, reorderEvents } from '@/lib/data'

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
    const { title, description, image, instagram, date, time, location, mapQuery, type, capacity, unlimitedCapacity, isActive } = body

    if (!title || !description || !date || !time || !location || !type) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    if (!unlimitedCapacity && !capacity) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const validTypes = ['workshop', 'seminar', 'hackathon', 'meetup']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Geçersiz etkinlik türü' }, { status: 400 })
    }

    const newEvent = addEvent({
      title,
      description,
      image: image || '',
      instagram: instagram || '',
      date,
      time,
      location,
      mapQuery: mapQuery || location,
      type,
      capacity: unlimitedCapacity ? 0 : parseInt(capacity),
      unlimitedCapacity: unlimitedCapacity === true,
      isActive: isActive !== false
    })

    return NextResponse.json({ success: true, event: newEvent })
  } catch {
    return NextResponse.json({ error: 'Etkinlik eklenemedi' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const orderIds = Array.isArray(body.orderIds) ? body.orderIds : []

    if (!orderIds.length) {
      return NextResponse.json({ error: 'Yeni sira bilgisi zorunludur' }, { status: 400 })
    }

    const reorderedEvents = reorderEvents(orderIds)
    return NextResponse.json({ success: true, events: reorderedEvents })
  } catch {
    return NextResponse.json({ error: 'Etkinlik sirasi guncellenemedi' }, { status: 500 })
  }
}
