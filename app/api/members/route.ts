import { NextResponse } from 'next/server'
import { addMember, getMembers, updateMemberStatus, deleteMember } from '@/lib/mysql-store'
import { appendApplicationToExcel } from '@/lib/excel'

export async function GET() {
  try {
    const members = await getMembers()
    return NextResponse.json(members)
  } catch {
    return NextResponse.json({ error: 'Üyeler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, team } = body

    if (!firstName || !lastName || !email || !team) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const newMember = await addMember({ firstName, lastName, email, phone: phone || '', team })

    // Excel export is optional; database is the source of truth.
    const excelSuccess = await appendApplicationToExcel({
      Ad: firstName,
      Soyad: lastName,
      Email: email,
      Telefon: phone || '',
      Ekip: team,
      'Başvuru Tarihi': new Date().toLocaleString('tr-TR')
    })

    if (!excelSuccess) {
      // Excel'e kaydedilemezse, memory'den de sil ki tutarsızlık olmasın
      await deleteMember(newMember.id)
      return NextResponse.json(
        { error: 'Başvuru dosyaya kaydedilemedi: Dosya (Excel) şu an açık olabilir. Lütfen daha sonra tekrar deneyin.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, member: newMember })
  } catch {
    return NextResponse.json({ error: 'Üye kaydedilemedi' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'ID ve status zorunlu' }, { status: 400 })
    }

    const member = await updateMemberStatus(id, status)
    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true, member })
  } catch {
    return NextResponse.json({ error: 'Üye güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID zorunlu' }, { status: 400 })
    }

    const deleted = await deleteMember(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Üye silinemedi' }, { status: 500 })
  }
}
