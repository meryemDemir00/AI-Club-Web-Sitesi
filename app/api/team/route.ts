import { NextResponse } from 'next/server'
import { addTeamMember, getTeamMembers, reorderTeamMembers } from '@/lib/mysql-store'

export async function GET() {
  try {
    const team = await getTeamMembers()
    return NextResponse.json(team)
  } catch {
    return NextResponse.json({ error: 'Ekip alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, department, bio, image, linkedin, github } = body

    if (!name || !role || !department) {
      return NextResponse.json({ error: 'Ad, rol ve bölüm zorunludur' }, { status: 400 })
    }

    const newMember = await addTeamMember({
      name,
      role,
      department,
      bio: bio || '',
      image: image || '',
      linkedin: linkedin || '',
      github: github || ''
    })

    return NextResponse.json({ success: true, member: newMember })
  } catch {
    return NextResponse.json({ error: 'Ekip üyesi eklenemedi' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const orderIds = Array.isArray(body.orderIds) ? body.orderIds : []

    if (!orderIds.length) {
      return NextResponse.json({ error: 'Yeni sira bilgisi zorunludur' }, { status: 400 })
    }

    const reorderedMembers = await reorderTeamMembers(orderIds)
    return NextResponse.json({ success: true, members: reorderedMembers })
  } catch {
    return NextResponse.json({ error: 'Ekip sirasi guncellenemedi' }, { status: 500 })
  }
}
