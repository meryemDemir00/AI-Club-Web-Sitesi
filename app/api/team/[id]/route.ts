import { NextResponse } from 'next/server'
import { updateTeamMember, deleteTeamMember } from '@/lib/data'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = updateTeamMember(id, body)

    if (!updated) {
      return NextResponse.json({ error: 'Ekip üyesi bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true, member: updated })
  } catch {
    return NextResponse.json({ error: 'Ekip üyesi güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = deleteTeamMember(id)

    if (!deleted) {
      return NextResponse.json({ error: 'Ekip üyesi bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ekip üyesi silinemedi' }, { status: 500 })
  }
}
