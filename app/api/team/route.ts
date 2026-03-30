import { NextResponse } from 'next/server'
import { getTeamMembers, addTeamMember } from '@/lib/data'

export async function GET() {
  try {
    const team = getTeamMembers()
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

    const newMember = addTeamMember({
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
