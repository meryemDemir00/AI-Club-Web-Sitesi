import { NextResponse } from 'next/server'
import { updateEvent, deleteEvent, toggleEventActive } from '@/lib/data'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Handle toggle active
    if (body.action === 'toggle') {
      const event = toggleEventActive(id)
      if (!event) {
        return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ success: true, event })
    }

    if (body.capacity !== undefined) {
      body.capacity = parseInt(body.capacity)
    }

    const updated = updateEvent(id, body)
    if (!updated) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true, event: updated })
  } catch {
    return NextResponse.json({ error: 'Etkinlik güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = deleteEvent(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Etkinlik silinemedi' }, { status: 500 })
  }
}
