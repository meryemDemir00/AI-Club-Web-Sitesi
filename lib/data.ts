// In-memory data store (since no database integration)
// In production, this would be replaced with a proper database

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // full name for backwards compat
  email: string;
  phone: string;
  team: string; // selected team (ekip)
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mapQuery: string; // Google Maps search query
  type: 'workshop' | 'seminar' | 'hackathon' | 'meetup';
  capacity: number;
  registered: number;
  isActive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio?: string;
  image: string;
  linkedin?: string;
  github?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ─── Team Members (mutable, managed via admin) ───────────────────────────────
let teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmet Yilmaz',
    role: 'Kulup Baskani',
    department: 'Bilgisayar Muhendisligi',
    bio: 'Yapay zeka ve makine öğrenmesi üzerine çalışmalar yapıyor.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    id: '2',
    name: 'Elif Demir',
    role: 'Baskan Yardimcisi',
    department: 'Yazilim Muhendisligi',
    bio: 'Doğal dil işleme ve veri bilimi alanında uzmanlaşıyor.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    id: '3',
    name: 'Can Ozturk',
    role: 'Teknik Koordinator',
    department: 'Bilgisayar Muhendisligi',
    bio: 'Derin öğrenme modelleri ve bilgisayarlı görü üzerine araştırmalar yapıyor.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    id: '4',
    name: 'Zeynep Kaya',
    role: 'Etkinlik Koordinatoru',
    department: 'Endustri Muhendisligi',
    bio: 'Topluluk etkinliklerini organize eder ve üye deneyimini iyileştirir.',
    image: '',
    linkedin: 'https://linkedin.com'
  },
  {
    id: '5',
    name: 'Mehmet Arslan',
    role: 'Sosyal Medya Sorumlusu',
    department: 'Iletisim',
    bio: 'İçerik üretimi ve sosyal medya stratejileriyle kulübü temsil eder.',
    image: '',
    linkedin: 'https://linkedin.com'
  },
  {
    id: '6',
    name: 'Ayse Celik',
    role: 'Egitim Koordinatoru',
    department: 'Matematik',
    bio: 'Eğitim programları geliştirerek üyelerin teknik becerilerini artırır.',
    image: '',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  }
];

// ─── Events (mutable, managed via admin) ─────────────────────────────────────
let events: Event[] = [
  {
    id: '1',
    title: 'ChatGPT ve Prompt Muhendisligi',
    description: 'Büyük dil modellerini etkili kullanma teknikleri ve prompt mühendisliği eğitimi. Bu workshopta katılımcılar ChatGPT ve diğer büyük dil modellerini profesyonel düzeyde kullanmayı öğrenecekler.',
    date: '2026-04-15',
    time: '14:00',
    location: 'Konferans Salonu A',
    mapQuery: 'Konferans Salonu A, Istanbul',
    type: 'workshop',
    capacity: 50,
    registered: 32,
    isActive: true
  },
  {
    id: '2',
    title: 'AI Hackathon 2026',
    description: '24 saatlik yapay zeka hackathonu. Takım oluşturun ve yaratıcı çözümler geliştirin! Kazananlara ödüller ve staj fırsatları bekliyor.',
    date: '2026-05-01',
    time: '09:00',
    location: 'Muhendislik Fakultesi',
    mapQuery: 'Mühendislik Fakültesi, Istanbul',
    type: 'hackathon',
    capacity: 100,
    registered: 78,
    isActive: true
  },
  {
    id: '3',
    title: 'Yapay Zeka Etigi Semineri',
    description: 'AI sistemlerinde etik sorunlar ve sorumlu yapay zeka geliştirme üzerine kapsamlı bir seminer. Sektör uzmanları ile soru-cevap oturumu da yapılacak.',
    date: '2026-04-22',
    time: '15:30',
    location: 'Online - Zoom',
    mapQuery: '',
    type: 'seminar',
    capacity: 200,
    registered: 145,
    isActive: true
  },
  {
    id: '4',
    title: 'PyTorch ile Deep Learning',
    description: 'Sıfırdan PyTorch öğrenin ve ilk sinir ağınızı oluşturun. Bilgisayarlı görü ve doğal dil işleme örnekleriyle uygulamalı eğitim.',
    date: '2026-04-28',
    time: '13:00',
    location: 'Bilgisayar Lab 3',
    mapQuery: 'Bilgisayar Lab, Istanbul',
    type: 'workshop',
    capacity: 30,
    registered: 28,
    isActive: true
  },
  {
    id: '5',
    title: 'AI Sohbet Bulusmasi',
    description: 'Rahat bir ortamda yapay zeka hakkında sohbet ve networking. Alandaki gelişmeleri tartışıyoruz, yeni insanlarla tanışıyoruz.',
    date: '2026-04-10',
    time: '18:00',
    location: 'Ogrenci Merkezi Kafe',
    mapQuery: 'Öğrenci Merkezi, Istanbul',
    type: 'meetup',
    capacity: 40,
    registered: 25,
    isActive: true
  }
];

// ─── In-memory runtime data ───────────────────────────────────────────────────
let members: Member[] = [];
let messages: ContactMessage[] = [];

// ─── Member functions ─────────────────────────────────────────────────────────
export function getMembers(): Member[] {
  return members;
}

export function addMember(member: Omit<Member, 'id' | 'createdAt' | 'status' | 'name'>): Member {
  const newMember: Member = {
    ...member,
    name: `${member.firstName} ${member.lastName}`,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  members.push(newMember);
  return newMember;
}

export function updateMemberStatus(id: string, status: Member['status']): Member | null {
  const member = members.find(m => m.id === id);
  if (member) {
    member.status = status;
    return member;
  }
  return null;
}

export function deleteMember(id: string): boolean {
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members.splice(index, 1);
    return true;
  }
  return false;
}

// ─── Message functions ────────────────────────────────────────────────────────
export function getMessages(): ContactMessage[] {
  return messages;
}

export function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
  const newMessage: ContactMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    read: false
  };
  messages.push(newMessage);
  return newMessage;
}

export function markMessageAsRead(id: string): boolean {
  const message = messages.find(m => m.id === id);
  if (message) {
    message.read = true;
    return true;
  }
  return false;
}

export function deleteMessage(id: string): boolean {
  const index = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages.splice(index, 1);
    return true;
  }
  return false;
}

// ─── Event functions ──────────────────────────────────────────────────────────
export function getEvents(): Event[] {
  return events;
}

export function addEvent(event: Omit<Event, 'id' | 'registered'>): Event {
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(),
    registered: 0
  };
  events.push(newEvent);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<Omit<Event, 'id'>>): Event | null {
  const event = events.find(e => e.id === id);
  if (event) {
    Object.assign(event, updates);
    return event;
  }
  return null;
}

export function deleteEvent(id: string): boolean {
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events.splice(index, 1);
    return true;
  }
  return false;
}

export function toggleEventActive(id: string): Event | null {
  const event = events.find(e => e.id === id);
  if (event) {
    event.isActive = !event.isActive;
    return event;
  }
  return null;
}

// ─── Team Member functions ────────────────────────────────────────────────────
export function getTeamMembers(): TeamMember[] {
  return teamMembers;
}

export function addTeamMember(member: Omit<TeamMember, 'id'>): TeamMember {
  const newMember: TeamMember = {
    ...member,
    id: Date.now().toString()
  };
  teamMembers.push(newMember);
  return newMember;
}

export function updateTeamMember(id: string, updates: Partial<Omit<TeamMember, 'id'>>): TeamMember | null {
  const member = teamMembers.find(m => m.id === id);
  if (member) {
    Object.assign(member, updates);
    return member;
  }
  return null;
}

export function deleteTeamMember(id: string): boolean {
  const index = teamMembers.findIndex(m => m.id === id);
  if (index !== -1) {
    teamMembers.splice(index, 1);
    return true;
  }
  return false;
}

// ─── Admin auth ───────────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'aiclub2026'
};

export function validateAdmin(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}
