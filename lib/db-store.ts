import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import type { ContactMessage, Event, Member, TeamMember } from '@/lib/data'

const dataDir = path.join(process.cwd(), 'data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'aiclub.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    team TEXT NOT NULL,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    linkedin TEXT NOT NULL DEFAULT '',
    github TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    map_query TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL CHECK (type IN ('workshop', 'seminar', 'hackathon', 'meetup')),
    capacity INTEGER NOT NULL DEFAULT 0,
    unlimited_capacity INTEGER NOT NULL DEFAULT 0,
    registered INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
  );
`)

const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmet Yilmaz',
    role: 'Kulup Baskani',
    department: 'Bilgisayar Muhendisligi',
    bio: 'Yapay zeka ve makine ogrenmesi uzerine calismalar yapiyor.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
  {
    id: '2',
    name: 'Elif Demir',
    role: 'Baskan Yardimcisi',
    department: 'Yazilim Muhendisligi',
    bio: 'Dogal dil isleme ve veri bilimi alaninda uzmanlasiyor.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
  {
    id: '3',
    name: 'Can Ozturk',
    role: 'Teknik Koordinator',
    department: 'Bilgisayar Muhendisligi',
    bio: 'Derin ogrenme modelleri ve bilgisayarli goru uzerine arastirmalar yapiyor.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
  {
    id: '4',
    name: 'Zeynep Kaya',
    role: 'Etkinlik Koordinatoru',
    department: 'Endustri Muhendisligi',
    bio: 'Topluluk etkinliklerini organize eder ve uye deneyimini iyilestirir.',
    image: '',
    linkedin: 'https://linkedin.com',
  },
  {
    id: '5',
    name: 'Mehmet Arslan',
    role: 'Sosyal Medya Sorumlusu',
    department: 'Iletisim',
    bio: 'Icerik uretimi ve sosyal medya stratejileriyle kulubu temsil eder.',
    image: '',
    linkedin: 'https://linkedin.com',
  },
  {
    id: '6',
    name: 'Ayse Celik',
    role: 'Egitim Koordinatoru',
    department: 'Matematik',
    bio: 'Egitim programlari gelistirerek uyelerin teknik becerilerini artirir.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
]

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'ChatGPT ve Prompt Muhendisligi',
    description:
      'Buyuk dil modellerini etkili kullanma teknikleri ve prompt muhendisligi egitimi. Bu workshopta katilimcilar ChatGPT ve diger buyuk dil modellerini profesyonel duzeyde kullanmayi ogrenecekler.',
    date: '2026-04-15',
    time: '14:00',
    location: 'Konferans Salonu A',
    mapQuery: 'Konferans Salonu A, Istanbul',
    type: 'workshop',
    capacity: 50,
    unlimitedCapacity: false,
    registered: 32,
    isActive: true,
  },
  {
    id: '2',
    title: 'AI Hackathon 2026',
    description:
      '24 saatlik yapay zeka hackathonu. Takim olusturun ve yaratici cozumler gelistirin. Kazananlara oduller ve staj firsatlari bekliyor.',
    date: '2026-05-01',
    time: '09:00',
    location: 'Muhendislik Fakultesi',
    mapQuery: 'Muhendislik Fakultesi, Istanbul',
    type: 'hackathon',
    capacity: 100,
    unlimitedCapacity: false,
    registered: 78,
    isActive: true,
  },
  {
    id: '3',
    title: 'Yapay Zeka Etigi Semineri',
    description:
      'AI sistemlerinde etik sorunlar ve sorumlu yapay zeka gelistirme uzerine kapsamli bir seminer. Sektor uzmanlari ile soru-cevap oturumu da yapilacak.',
    date: '2026-04-22',
    time: '15:30',
    location: 'Online - Zoom',
    mapQuery: '',
    type: 'seminar',
    capacity: 200,
    unlimitedCapacity: false,
    registered: 145,
    isActive: true,
  },
  {
    id: '4',
    title: 'PyTorch ile Deep Learning',
    description:
      'Sifirdan PyTorch ogrenin ve ilk sinir aginizi olusturun. Bilgisayarli goru ve dogal dil isleme ornekleriyle uygulamali egitim.',
    date: '2026-04-28',
    time: '13:00',
    location: 'Bilgisayar Lab 3',
    mapQuery: 'Bilgisayar Lab, Istanbul',
    type: 'workshop',
    capacity: 30,
    unlimitedCapacity: false,
    registered: 28,
    isActive: true,
  },
  {
    id: '5',
    title: 'AI Sohbet Bulusmasi',
    description:
      'Rahat bir ortamda yapay zeka hakkinda sohbet ve networking. Alandaki gelismeleri tartisiyoruz, yeni insanlarla tanisiyoruz.',
    date: '2026-04-10',
    time: '18:00',
    location: 'Ogrenci Merkezi Kafe',
    mapQuery: 'Ogrenci Merkezi, Istanbul',
    type: 'meetup',
    capacity: 40,
    unlimitedCapacity: false,
    registered: 25,
    isActive: true,
  },
]

function seedData() {
  const teamCount = db.prepare('SELECT COUNT(*) as count FROM team_members').get() as { count: number }
  if (teamCount.count === 0) {
    const insertTeam = db.prepare(`
      INSERT INTO team_members (id, name, role, department, bio, image, linkedin, github)
      VALUES (@id, @name, @role, @department, @bio, @image, @linkedin, @github)
    `)
    for (const member of initialTeamMembers) {
      insertTeam.run({
        id: member.id,
        name: member.name,
        role: member.role,
        department: member.department,
        bio: member.bio || '',
        image: member.image || '',
        linkedin: member.linkedin || '',
        github: member.github || '',
      })
    }
  }

  const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get() as { count: number }
  if (eventCount.count === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, description, date, time, location, map_query, type, capacity, unlimited_capacity, registered, is_active)
      VALUES (@id, @title, @description, @date, @time, @location, @mapQuery, @type, @capacity, @unlimitedCapacity, @registered, @isActive)
    `)
    for (const event of initialEvents) {
      insertEvent.run({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        mapQuery: event.mapQuery || '',
        type: event.type,
        capacity: event.capacity,
        unlimitedCapacity: event.unlimitedCapacity ? 1 : 0,
        registered: event.registered,
        isActive: event.isActive ? 1 : 0,
      })
    }
  }
}

seedData()

function createId() {
  return Date.now().toString()
}

function mapMemberRow(row: Record<string, unknown>): Member {
  return {
    id: String(row.id),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    team: String(row.team),
    createdAt: String(row.created_at),
    status: row.status as Member['status'],
  }
}

function mapMessageRow(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    subject: String(row.subject),
    message: String(row.message),
    createdAt: String(row.created_at),
    read: Number(row.read) === 1,
  }
}

function mapTeamRow(row: Record<string, unknown>): TeamMember {
  return {
    id: String(row.id),
    name: String(row.name),
    role: String(row.role),
    department: String(row.department),
    bio: String(row.bio || ''),
    image: String(row.image || ''),
    linkedin: String(row.linkedin || ''),
    github: String(row.github || ''),
  }
}

function mapEventRow(row: Record<string, unknown>): Event {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    date: String(row.date),
    time: String(row.time),
    location: String(row.location),
    mapQuery: String(row.map_query || ''),
    type: row.type as Event['type'],
    capacity: Number(row.capacity),
    unlimitedCapacity: Number(row.unlimited_capacity) === 1,
    registered: Number(row.registered),
    isActive: Number(row.is_active) === 1,
  }
}

export function getMembers(): Member[] {
  const rows = db.prepare('SELECT * FROM members ORDER BY datetime(created_at) DESC').all() as Record<string, unknown>[]
  return rows.map(mapMemberRow)
}

export function addMember(member: Omit<Member, 'id' | 'createdAt' | 'status' | 'name'>): Member {
  const newMember: Member = {
    ...member,
    name: `${member.firstName} ${member.lastName}`,
    id: createId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  db.prepare(`
    INSERT INTO members (id, first_name, last_name, name, email, phone, team, created_at, status)
    VALUES (@id, @firstName, @lastName, @name, @email, @phone, @team, @createdAt, @status)
  `).run(newMember)

  return newMember
}

export function updateMemberStatus(id: string, status: Member['status']): Member | null {
  const result = db.prepare('UPDATE members SET status = ? WHERE id = ?').run(status, id)
  if (result.changes === 0) return null
  const row = db.prepare('SELECT * FROM members WHERE id = ?').get(id) as Record<string, unknown> | undefined
  return row ? mapMemberRow(row) : null
}

export function deleteMember(id: string): boolean {
  return db.prepare('DELETE FROM members WHERE id = ?').run(id).changes > 0
}

export function getMessages(): ContactMessage[] {
  const rows = db.prepare('SELECT * FROM messages ORDER BY datetime(created_at) DESC').all() as Record<string, unknown>[]
  return rows.map(mapMessageRow)
}

export function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
  const newMessage: ContactMessage = {
    ...message,
    id: createId(),
    createdAt: new Date().toISOString(),
    read: false,
  }

  db.prepare(`
    INSERT INTO messages (id, name, email, subject, message, created_at, read)
    VALUES (@id, @name, @email, @subject, @message, @createdAt, @read)
  `).run({
    ...newMessage,
    read: 0,
  })

  return newMessage
}

export function markMessageAsRead(id: string): boolean {
  return db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(id).changes > 0
}

export function deleteMessage(id: string): boolean {
  return db.prepare('DELETE FROM messages WHERE id = ?').run(id).changes > 0
}

export function getEvents(): Event[] {
  const rows = db.prepare('SELECT * FROM events ORDER BY date ASC, time ASC').all() as Record<string, unknown>[]
  return rows.map(mapEventRow)
}

export function addEvent(event: Omit<Event, 'id' | 'registered'>): Event {
  const newEvent: Event = {
    ...event,
    id: createId(),
    registered: 0,
    unlimitedCapacity: event.unlimitedCapacity === true,
    isActive: event.isActive !== false,
  }

  db.prepare(`
    INSERT INTO events (id, title, description, date, time, location, map_query, type, capacity, unlimited_capacity, registered, is_active)
    VALUES (@id, @title, @description, @date, @time, @location, @mapQuery, @type, @capacity, @unlimitedCapacity, @registered, @isActive)
  `).run({
    ...newEvent,
    mapQuery: newEvent.mapQuery || '',
    unlimitedCapacity: newEvent.unlimitedCapacity ? 1 : 0,
    isActive: newEvent.isActive ? 1 : 0,
  })

  return newEvent
}

export function updateEvent(id: string, updates: Partial<Omit<Event, 'id'>>): Event | null {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as Record<string, unknown> | undefined
  if (!row) return null

  const current = mapEventRow(row)
  const next: Event = {
    ...current,
    ...updates,
    unlimitedCapacity: updates.unlimitedCapacity ?? current.unlimitedCapacity,
    isActive: updates.isActive ?? current.isActive,
  }

  db.prepare(`
    UPDATE events
    SET title = @title,
        description = @description,
        date = @date,
        time = @time,
        location = @location,
        map_query = @mapQuery,
        type = @type,
        capacity = @capacity,
        unlimited_capacity = @unlimitedCapacity,
        registered = @registered,
        is_active = @isActive
    WHERE id = @id
  `).run({
    ...next,
    mapQuery: next.mapQuery || '',
    unlimitedCapacity: next.unlimitedCapacity ? 1 : 0,
    isActive: next.isActive ? 1 : 0,
  })

  return next
}

export function deleteEvent(id: string): boolean {
  return db.prepare('DELETE FROM events WHERE id = ?').run(id).changes > 0
}

export function toggleEventActive(id: string): Event | null {
  const row = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as Record<string, unknown> | undefined
  if (!row) return null
  const current = mapEventRow(row)
  const nextActive = !current.isActive
  db.prepare('UPDATE events SET is_active = ? WHERE id = ?').run(nextActive ? 1 : 0, id)
  return { ...current, isActive: nextActive }
}

export function getTeamMembers(): TeamMember[] {
  const rows = db.prepare('SELECT * FROM team_members ORDER BY name ASC').all() as Record<string, unknown>[]
  return rows.map(mapTeamRow)
}

export function addTeamMember(member: Omit<TeamMember, 'id'>): TeamMember {
  const newMember: TeamMember = {
    ...member,
    id: createId(),
  }

  db.prepare(`
    INSERT INTO team_members (id, name, role, department, bio, image, linkedin, github)
    VALUES (@id, @name, @role, @department, @bio, @image, @linkedin, @github)
  `).run({
    ...newMember,
    bio: newMember.bio || '',
    image: newMember.image || '',
    linkedin: newMember.linkedin || '',
    github: newMember.github || '',
  })

  return newMember
}

export function updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id'>>): TeamMember | null {
  const row = db.prepare('SELECT * FROM team_members WHERE id = ?').get(id) as Record<string, unknown> | undefined
  if (!row) return null

  const current = mapTeamRow(row)
  const next: TeamMember = { ...current, ...updates }

  db.prepare(`
    UPDATE team_members
    SET name = @name,
        role = @role,
        department = @department,
        bio = @bio,
        image = @image,
        linkedin = @linkedin,
        github = @github
    WHERE id = @id
  `).run({
    ...next,
    bio: next.bio || '',
    image: next.image || '',
    linkedin: next.linkedin || '',
    github: next.github || '',
  })

  return next
}

export function deleteTeamMember(id: string): boolean {
  return db.prepare('DELETE FROM team_members WHERE id = ?').run(id).changes > 0
}

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'aiclub2026',
}

export function validateAdmin(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
