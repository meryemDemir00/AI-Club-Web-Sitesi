import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from 'mysql2/promise'
import type { ContactMessage, Event, Member, TeamMember } from '@/lib/data'
import {
  addEvent as addEventFallback,
  addMember as addMemberFallback,
  addMessage as addMessageFallback,
  addTeamMember as addTeamMemberFallback,
  deleteEvent as deleteEventFallback,
  deleteMember as deleteMemberFallback,
  deleteMessage as deleteMessageFallback,
  deleteTeamMember as deleteTeamMemberFallback,
  getEvents as getEventsFallback,
  getMembers as getMembersFallback,
  getMessages as getMessagesFallback,
  getTeamMembers as getTeamMembersFallback,
  markMessageAsRead as markMessageAsReadFallback,
  reorderEvents as reorderEventsFallback,
  reorderTeamMembers as reorderTeamMembersFallback,
  toggleEventActive as toggleEventActiveFallback,
  updateEvent as updateEventFallback,
  updateMemberStatus as updateMemberStatusFallback,
  updateTeamMember as updateTeamMemberFallback,
  validateAdmin as validateAdminFallback,
} from '@/lib/data'

type CountRow = RowDataPacket & { count: number }

let pool: Pool | null = null
let initPromise: Promise<void> | null = null

function hasMySqlConfig() {
  return Boolean(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
}

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
    image: '',
    instagram: '',
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
    image: '',
    instagram: '',
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
    image: '',
    instagram: '',
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
    image: '',
    instagram: '',
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
    image: '',
    instagram: '',
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

function assertDatabaseName(name: string) {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error('MYSQL_DATABASE only allows letters, numbers and underscore.')
  }
}

async function ensureDatabaseExists() {
  const host = process.env.MYSQL_HOST
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD || ''
  const database = process.env.MYSQL_DATABASE

  if (!host || !user || !database) {
    throw new Error('MySQL environment variables are missing. Check MYSQL_HOST, MYSQL_USER and MYSQL_DATABASE.')
  }

  assertDatabaseName(database)

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    charset: 'utf8mb4',
    multipleStatements: true,
  })

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  await connection.end()
}

function getPool() {
  if (!pool) {
    const host = process.env.MYSQL_HOST
    const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306
    const user = process.env.MYSQL_USER
    const password = process.env.MYSQL_PASSWORD || ''
    const database = process.env.MYSQL_DATABASE

    if (!host || !user || !database) {
      throw new Error('MySQL environment variables are missing. Check MYSQL_HOST, MYSQL_USER and MYSQL_DATABASE.')
    }

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
    })
  }

  return pool
}

async function initializeDatabase() {
  await ensureDatabaseExists()
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
      display_order INT NOT NULL DEFAULT 0,
      INDEX idx_team_members_order (display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await activePool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(50) NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(500) NOT NULL DEFAULT '',
      instagram VARCHAR(500) NOT NULL DEFAULT '',
      date DATE NOT NULL,
      time TIME NOT NULL,
      location VARCHAR(255) NOT NULL,
      map_query VARCHAR(255) NOT NULL DEFAULT '',
      type ENUM('workshop', 'seminar', 'hackathon', 'meetup') NOT NULL,
      capacity INT NOT NULL DEFAULT 0,
      unlimited_capacity TINYINT(1) NOT NULL DEFAULT 0,
      registered INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      display_order INT NOT NULL DEFAULT 0,
      INDEX idx_events_date (date),
      INDEX idx_events_type (type),
      INDEX idx_events_active (is_active),
      INDEX idx_events_order (display_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  const [teamCountRows] = await activePool.query<CountRow[]>('SELECT COUNT(*) AS count FROM team_members')
  if (teamCountRows[0]?.count === 0) {
    for (const [index, member] of initialTeamMembers.entries()) {
      await activePool.query(
        `INSERT INTO team_members (id, name, role, department, bio, image, linkedin, github, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          member.id,
          member.name,
          member.role,
          member.department,
          member.bio || '',
          member.image || '',
          member.linkedin || '',
          member.github || '',
          index,
        ],
      )
    }
  }

  const [eventCountRows] = await activePool.query<CountRow[]>('SELECT COUNT(*) AS count FROM events')
  if (eventCountRows[0]?.count === 0) {
    for (const [index, event] of initialEvents.entries()) {
      await activePool.query(
        `INSERT INTO events (id, title, description, image, instagram, date, time, location, map_query, type, capacity, unlimited_capacity, registered, is_active, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.title,
          event.description,
          event.image || '',
          event.instagram || '',
          event.date,
          `${event.time}:00`,
          event.location,
          event.mapQuery || '',
          event.type,
          event.capacity,
          event.unlimitedCapacity ? 1 : 0,
          event.registered,
          event.isActive ? 1 : 0,
          index,
        ],
      )
    }
  }
}

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = initializeDatabase()
  }

  await initPromise
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
  const rawDate = row.date
  const rawTime = row.time
  const dateValue = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : String(rawDate)
  const timeValue =
    typeof rawTime === 'string'
      ? rawTime.slice(0, 5)
      : new Date(rawTime).toISOString().slice(11, 16)

  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    image: String(row.image || ''),
    instagram: String(row.instagram || ''),
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
  if (!hasMySqlConfig()) return getMembersFallback()
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM members ORDER BY created_at DESC')
  return rows.map(mapMemberRow)
}

export async function addMember(member: Omit<Member, 'id' | 'createdAt' | 'status' | 'name'>): Promise<Member> {
  if (!hasMySqlConfig()) return addMemberFallback(member)
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
  if (!hasMySqlConfig()) return updateMemberStatusFallback(id, status)
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('UPDATE members SET status = ? WHERE id = ?', [status, id])
  if (result.affectedRows === 0) return null
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM members WHERE id = ?', [id])
  return rows[0] ? mapMemberRow(rows[0]) : null
}

export async function deleteMember(id: string): Promise<boolean> {
  if (!hasMySqlConfig()) return deleteMemberFallback(id)
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM members WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (!hasMySqlConfig()) return getMessagesFallback()
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM messages ORDER BY created_at DESC')
  return rows.map(mapMessageRow)
}

export async function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
  if (!hasMySqlConfig()) return addMessageFallback(message)
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
  if (!hasMySqlConfig()) return markMessageAsReadFallback(id)
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('UPDATE messages SET `read` = 1 WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (!hasMySqlConfig()) return deleteMessageFallback(id)
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM messages WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function getEvents(): Promise<Event[]> {
  if (!hasMySqlConfig()) return getEventsFallback()
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>(
    'SELECT * FROM events ORDER BY display_order ASC, date ASC, time ASC',
  )
  return rows.map(mapEventRow)
}

export async function addEvent(event: Omit<Event, 'id' | 'registered'>): Promise<Event> {
  if (!hasMySqlConfig()) return addEventFallback(event)
  await ensureInitialized()
  const [orderRows] = await getPool().query<CountRow[]>('SELECT COUNT(*) AS count FROM events')
  const newEvent: Event = {
    ...event,
    id: createId(),
    registered: 0,
    unlimitedCapacity: event.unlimitedCapacity === true,
    isActive: event.isActive !== false,
  }

  await getPool().query(
    `INSERT INTO events (id, title, description, image, instagram, date, time, location, map_query, type, capacity, unlimited_capacity, registered, is_active, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newEvent.id,
      newEvent.title,
      newEvent.description,
      newEvent.image || '',
      newEvent.instagram || '',
      newEvent.date,
      `${newEvent.time}:00`,
      newEvent.location,
      newEvent.mapQuery || '',
      newEvent.type,
      newEvent.capacity,
      newEvent.unlimitedCapacity ? 1 : 0,
      newEvent.registered,
      newEvent.isActive ? 1 : 0,
      orderRows[0]?.count || 0,
    ],
  )

  return newEvent
}

export async function updateEvent(id: string, updates: Partial<Omit<Event, 'id'>>): Promise<Event | null> {
  if (!hasMySqlConfig()) return updateEventFallback(id, updates)
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
     SET title = ?, description = ?, image = ?, instagram = ?, date = ?, time = ?, location = ?, map_query = ?, type = ?, capacity = ?, unlimited_capacity = ?, registered = ?, is_active = ?
     WHERE id = ?`,
    [
      next.title,
      next.description,
      next.image || '',
      next.instagram || '',
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
  if (!hasMySqlConfig()) return deleteEventFallback(id)
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM events WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function toggleEventActive(id: string): Promise<Event | null> {
  if (!hasMySqlConfig()) return toggleEventActiveFallback(id)
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>('SELECT * FROM events WHERE id = ?', [id])
  if (!rows[0]) return null
  const current = mapEventRow(rows[0])
  const nextActive = !current.isActive
  await getPool().query('UPDATE events SET is_active = ? WHERE id = ?', [nextActive ? 1 : 0, id])
  return { ...current, isActive: nextActive }
}

export async function reorderEvents(orderIds: string[]): Promise<Event[]> {
  if (!hasMySqlConfig()) return reorderEventsFallback(orderIds)
  await ensureInitialized()
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()
    for (const [index, id] of orderIds.entries()) {
      await connection.query('UPDATE events SET display_order = ? WHERE id = ?', [index, id])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }

  return getEvents()
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!hasMySqlConfig()) return getTeamMembersFallback()
  await ensureInitialized()
  const [rows] = await getPool().query<RowDataPacket[]>(
    'SELECT * FROM team_members ORDER BY display_order ASC, name ASC',
  )
  return rows.map(mapTeamRow)
}

export async function addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
  if (!hasMySqlConfig()) return addTeamMemberFallback(member)
  await ensureInitialized()
  const [orderRows] = await getPool().query<CountRow[]>('SELECT COUNT(*) AS count FROM team_members')
  const newMember: TeamMember = {
    ...member,
    id: createId(),
  }

  await getPool().query(
    `INSERT INTO team_members (id, name, role, department, bio, image, linkedin, github, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      newMember.id,
      newMember.name,
      newMember.role,
      newMember.department,
      newMember.bio || '',
      newMember.image || '',
      newMember.linkedin || '',
      newMember.github || '',
      orderRows[0]?.count || 0,
    ],
  )

  return newMember
}

export async function updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id'>>): Promise<TeamMember | null> {
  if (!hasMySqlConfig()) return updateTeamMemberFallback(id, updates)
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
  if (!hasMySqlConfig()) return deleteTeamMemberFallback(id)
  await ensureInitialized()
  const [result] = await getPool().query<ResultSetHeader>('DELETE FROM team_members WHERE id = ?', [id])
  return result.affectedRows > 0
}

export async function reorderTeamMembers(orderIds: string[]): Promise<TeamMember[]> {
  if (!hasMySqlConfig()) return reorderTeamMembersFallback(orderIds)
  await ensureInitialized()
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()
    for (const [index, id] of orderIds.entries()) {
      await connection.query('UPDATE team_members SET display_order = ? WHERE id = ?', [index, id])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }

  return getTeamMembers()
}

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'aiclub2026',
}

export async function validateAdmin(username: string, password: string): Promise<boolean> {
  if (!hasMySqlConfig()) return validateAdminFallback(username, password)
  await ensureInitialized()
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
