import { NextResponse } from 'next/server'
import { updateEvent, deleteEvent, toggleEventActive } from '@/lib/mysql-store'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Handle toggle active
    if (body.action === 'toggle') {
      const event = await toggleEventActive(id)
      if (!event) {
        return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ success: true, event })
    }

    if (body.unlimitedCapacity === true) {
      body.capacity = 0
    } else if (body.capacity !== undefined) {
      body.capacity = parseInt(body.capacity)
    }

    const updated = await updateEvent(id, body)
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
    const deleted = await deleteEvent(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Etkinlik silinemedi' }, { status: 500 })
  }
}
