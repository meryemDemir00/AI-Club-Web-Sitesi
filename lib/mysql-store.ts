import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import type { ContactMessage, Event, Member, TeamMember } from '@/lib/data'

type CountRow = RowDataPacket & { count: number }

let pool: Pool | null = null
let initPromise: Promise<void> | null = null

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

function createId() {
  return Date.now().toString()
}

function getPool() {
  if (!pool) {
    const {
      MYSQL_HOST,
      MYSQL_PORT,
      MYSQL_USER,
      MYSQL_PASSWORD,
      MYSQL_DATABASE,
    } = process.env

    if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
      throw new Error('MySQL environment variables are missing. Check MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.')
    }

    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD || '',
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    })
  }

  return pool
}

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = initializeDatabase()
  }

  await initPromise
}

async function initializeDatabase() {
  const activePool = getPool()

  await activePool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      name VARCHAR(201) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL DEFAULT '',
      team VARCHAR(100) NOT NULL,
      created_at DATETIME NOT NULL,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      INDEX idx_members_created_at (created_at),
      INDEX idx_members_status (status),
      INDEX idx_members_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await activePool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME NOT NULL,
      \`read\` TINYINT(1) NOT NULL DEFAULT 0,
      INDEX idx_messages_created_at (created_at),
      INDEX idx_messages_read (\`read\`),
      INDEX idx_messages_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await activePool.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      role VARCHAR(150) NOT NULL,
      department VARCHAR(150) NOT NULL,
      bio TEXT NOT NULL,
      image VARCHAR(500) NOT NULL DEFAULT '',
      linkedin VARCHAR(500) NOT NULL DEFAULT '',
      github VARCHAR(500) NOT NULL DEFAULT '',
      INDEX idx_team_members_name (name),
      INDEX idx_team_members_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await activePool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      location VARCHAR(255) NOT NULL,
      map_query VARCHAR(255) NOT NULL DEFAULT '',
      type ENUM('workshop', 'seminar', 'hackathon', 'meetup') NOT NULL,
      capacity INT NOT NULL DEFAULT 0,
      unlimited_capacity TINYINT(1) NOT NULL DEFAULT 0,
      registered INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      INDEX idx_events_date (date),
      INDEX idx_events_type (type),
      INDEX idx_events_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  const [teamRows] = await activePool.query<CountRow[]>('SELECT COUNT(*) as count FROM team_members')
  if (teamRows[0]?.count === 0) {
    for (const member of initialTeamMembers) {
      await activePool.query(
        `INSERT INTO team_members (id, name, role, department, bio, image, linkedin, github)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          member.id,
          member.name,
          member.role,
          member.department,
          member.bio || '',
          member.image || '',
          member.linkedin || '',
          member.github || '',
        ],
      )
    }
  }

  const [eventRows] = await activePool.query<CountRow[]>('SELECT COUNT(*) as count FROM events')
  if (eventRows[0]?.count === 0) {
    for (const event of initialEvents) {
      await activePool.query(
        `INSERT INTO events (id, title, description, date, time, location, map_query, type, capacity, unlimited_capacity, registered, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.title,
          event.description,
          event.date,
          event.time,
          event.location,
          event.mapQuery || '',
          event.type,
          event.capacity,
          event.unlimitedCapacity ? 1 : 0,
          event.registered,
          event.isActive ? 1 : 0,
        ],
      )
    }
  }
}

function mapMemberRow(row: RowDataPacket): Member {
  return {
    id: String(row.id),
    firstName: String(row.first_name),
    lastName: String(row.last_name),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    team: String(row.team),
    createdAt: new Date(row.created_at).toISOString(),
    status: row.status as Member['status'],
  }
}

function mapMessageRow(row: RowDataPacket): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    subject: String(row.subject),
    message: String(row.message),
    createdAt: new Date(row.created_at).toISOString(),
    read: Number(row.read) === 1,
  }
}

function mapTeamRow(row: RowDataPacket): TeamMember {
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

function mapEventRow(row: RowDataPacket): Event {
  const dateValue = row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date)
  const timeValue =
    typeof row.time === 'string'
      ? row.time.slice(0, 5)
      : new Date(row.time).toISOString().slice(11, 16)

  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    date: dateValue,
    time: timeValue,
    location: String(row.location),
    mapQuery: String(row.map_query || ''),
    type: row.type as Event['type'],
    capacity: Number(row.capacity),
    unlimitedCapacity: Number(row.unlimited_capacity) === 1,
    registered: Number(row.registered),
    isActive: Number(row.is_active) === 1,
  }
}

export async function getMembers(): Promise<Member[]> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM members ORDER BY created_at DESC')
  return rows.map(mapMemberRow)
}

export async function addMember(member: Omit<Member, 'id' | 'createdAt' | 'status' | 'name'>): Promise<Member> {
  await ensureInitialized()
  const newMember: Member = {
    ...member,
    name: `${member.firstName} ${member.lastName}`,
    id: createId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  await getPool().query(
    `INSERT INTO members (id, first_name, last_name, name, email, phone, team, created_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newMember.id,
      newMember.firstName,
      newMember.lastName,
      newMember.name,
      newMember.email,
      newMember.phone,
      newMember.team,
      newMember.createdAt.slice(0, 19).replace('T', ' '),
      newMember.status,
    ],
  )

  return newMember
}

export async function updateMemberStatus(id: string, status: Member['status']): Promise<Member | null> {
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('UPDATE members SET status = ? WHERE id = ?', [status, id])
  if (result.affectedRows === 0) return null
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM members WHERE id = ?', [id])
  return rows[0] ? mapMemberRow(rows[0]) : null
}

export async function deleteMember(id: string): Promise<boolean> {
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM members WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function getMessages(): Promise<ContactMessage[]> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM messages ORDER BY created_at DESC')
  return rows.map(mapMessageRow)
}

export async function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
  await ensureInitialized()
  const newMessage: ContactMessage = {
    ...message,
    id: createId(),
    createdAt: new Date().toISOString(),
    read: false,
  }

  await getPool().query(
    'INSERT INTO messages (id, name, email, subject, message, created_at, `read`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      newMessage.id,
      newMessage.name,
      newMessage.email,
      newMessage.subject,
      newMessage.message,
      newMessage.createdAt.slice(0, 19).replace('T', ' '),
      0,
    ],
  )

  return newMessage
}

export async function markMessageAsRead(id: string): Promise<boolean> {
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('UPDATE messages SET `read` = 1 WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function deleteMessage(id: string): Promise<boolean> {
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM messages WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function getEvents(): Promise<Event[]> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM events ORDER BY date ASC, time ASC')
  return rows.map(mapEventRow)
}

export async function addEvent(event: Omit<Event, 'id' | 'registered'>): Promise<Event> {
  await ensureInitialized()
  const newEvent: Event = {
    ...event,
    id: createId(),
    registered: 0,
    unlimitedCapacity: event.unlimitedCapacity === true,
    isActive: event.isActive !== false,
  }

  await getPool().query(
    `INSERT INTO events (id, title, description, date, time, location, map_query, type, capacity, unlimited_capacity, registered, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newEvent.id,
      newEvent.title,
      newEvent.description,
      newEvent.date,
      `${newEvent.time}:00`,
      newEvent.location,
      newEvent.mapQuery || '',
      newEvent.type,
      newEvent.capacity,
      newEvent.unlimitedCapacity ? 1 : 0,
      newEvent.registered,
      newEvent.isActive ? 1 : 0,
    ],
  )

  return newEvent
}

export async function updateEvent(id: string, updates: Partial<Omit<Event, 'id'>>): Promise<Event | null> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM events WHERE id = ?', [id])
  if (!rows[0]) return null
  const current = mapEventRow(rows[0])
  const next: Event = {
    ...current,
    ...updates,
    unlimitedCapacity: updates.unlimitedCapacity ?? current.unlimitedCapacity,
    isActive: updates.isActive ?? current.isActive,
  }

  await getPool().query(
    `UPDATE events
     SET title = ?, description = ?, date = ?, time = ?, location = ?, map_query = ?, type = ?, capacity = ?, unlimited_capacity = ?, registered = ?, is_active = ?
     WHERE id = ?`,
    [
      next.title,
      next.description,
      next.date,
      `${next.time}:00`,
      next.location,
      next.mapQuery || '',
      next.type,
      next.capacity,
      next.unlimitedCapacity ? 1 : 0,
      next.registered,
      next.isActive ? 1 : 0,
      id,
    ],
  )

  return next
}

export async function deleteEvent(id: string): Promise<boolean> {
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM events WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function toggleEventActive(id: string): Promise<Event | null> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM events WHERE id = ?', [id])
  if (!rows[0]) return null
  const current = mapEventRow(rows[0])
  const nextActive = !current.isActive
  await getPool().query('UPDATE events SET is_active = ? WHERE id = ?', [nextActive ? 1 : 0, id])
  return { ...current, isActive: nextActive }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM team_members ORDER BY name ASC')
  return rows.map(mapTeamRow)
}

export async function addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  await ensureInitialized()
  const newMember: TeamMember = { ...member, id: createId() }

  await getPool().query(
    `INSERT INTO team_members (id, name, role, department, bio, image, linkedin, github)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newMember.id,
      newMember.name,
      newMember.role,
      newMember.department,
      newMember.bio || '',
      newMember.image || '',
      newMember.linkedin || '',
      newMember.github || '',
    ],
  )

  return newMember
}

export async function updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id'>>): Promise<TeamMember | null> {
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM team_members WHERE id = ?', [id])
  if (!rows[0]) return null
  const current = mapTeamRow(rows[0])
  const next: TeamMember = { ...current, ...updates }

  await getPool().query(
    `UPDATE team_members
     SET name = ?, role = ?, department = ?, bio = ?, image = ?, linkedin = ?, github = ?
     WHERE id = ?`,
    [
      next.name,
      next.role,
      next.department,
      next.bio || '',
      next.image || '',
      next.linkedin || '',
      next.github || '',
      id,
    ],
  )

  return next
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM team_members WHERE id = ?', [id])
  return result.affectedRows > 0
}

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'aiclub2026',
}

export async function validateAdmin(username: string, password: string): Promise<boolean> {
  await ensureInitialized()
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
