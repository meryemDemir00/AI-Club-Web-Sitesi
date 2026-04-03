'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteLogo } from '@/components/site-logo'
import type { Member, ContactMessage, TeamMember, Event } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Users, Mail, LogOut, CheckCircle, XCircle, Clock,
  Trash2, Eye, UserCheck, UserX, UserPlus, Pencil, Save,
  X, Calendar, CalendarPlus, ToggleLeft, ToggleRight, Megaphone,
  GripVertical, ImagePlus
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type TeamForm = { name: string; role: string; department: string; bio: string; image: string; linkedin: string; github: string }
type EventForm = { title: string; description: string; image: string; instagram: string; date: string; time: string; location: string; mapQuery: string; type: string; capacity: string; unlimitedCapacity: boolean }
const emptyTeamForm: TeamForm = { name: '', role: '', department: '', bio: '', image: '', linkedin: '', github: '' }
const emptyEventForm: EventForm = { title: '', description: '', image: '', instagram: '', date: '', time: '', location: '', mapQuery: '', type: 'workshop', capacity: '50', unlimitedCapacity: false }
const teamRoleOptions = [
  'Baskan',
  'Baskan Yardimcisi',
  'Sayman',
  'Yazman',
  'Sekreter',
  'Egitim Birimi Baskani',
  'Sponsorluk Birimi Baskani',
  'Organizasyon Birimi Baskani',
  'Arge ve Proje Birimi Baskani',
  'Sosyal Medya Birimi Baskani'
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, count, label, color }: { icon: React.ElementType; count: number; label: string; color: string }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  // Team form states
  const [teamForm, setTeamForm] = useState<TeamForm>(emptyTeamForm)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [teamImageError, setTeamImageError] = useState('')
  const [draggedTeamId, setDraggedTeamId] = useState<string | null>(null)
  const [dragOverTeamId, setDragOverTeamId] = useState<string | null>(null)
  const teamImageInputRef = useRef<HTMLInputElement | null>(null)

  // Event form states
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventImageError, setEventImageError] = useState('')
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
  const [dragOverEventId, setDragOverEventId] = useState<string | null>(null)
  const eventImageInputRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()

  const fetchData = useCallback(async () => {
    try {
      const [membersRes, messagesRes, teamRes, eventsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/messages'),
        fetch('/api/team'),
        fetch('/api/events')
      ])
      if (membersRes.ok) setMembers(await membersRes.json())
      if (messagesRes.ok) setMessages(await messagesRes.json())
      if (teamRes.ok) setTeam(await teamRes.json())
      if (eventsRes.ok) setEvents(await eventsRes.json())
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => {
    fetch('/api/admin/check').then(res => {
      if (!res.ok) router.push('/admin')
      else fetchData()
    }).catch(() => router.push('/admin'))
  }, [router, fetchData])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  // ─── Member handlers ─────────────────────────────────
  const handleMemberStatus = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch('/api/members', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    if (res.ok) setMembers(m => m.map(x => x.id === id ? { ...x, status } : x))
  }
  const handleDeleteMember = async (id: string) => {
    if (!confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' })
    if (res.ok) setMembers(m => m.filter(x => x.id !== id))
  }

  // ─── Message handlers ─────────────────────────────────
  const handleMarkAsRead = async (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.read) {
      await fetch('/api/messages', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id })
      })
      setMessages(m => m.map(x => x.id === message.id ? { ...x, read: true } : x))
    }
  }
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
    if (res.ok) { setMessages(m => m.filter(x => x.id !== id)); if (selectedMessage?.id === id) setSelectedMessage(null) }
  }

  // ─── Team handlers ────────────────────────────────────
  const handleSaveTeam = async () => {
    if (!teamForm.name || !teamForm.role || !teamForm.department) return
    if (editingTeamId) {
      const res = await fetch(`/api/team/${editingTeamId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      })
      if (res.ok) {
        const { member } = await res.json()
        setTeam(t => t.map(x => x.id === editingTeamId ? member : x))
      }
    } else {
      const res = await fetch('/api/team', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamForm)
      })
      if (res.ok) {
        const { member } = await res.json()
        setTeam(t => [...t, member])
      }
    }
    setTeamForm(emptyTeamForm)
    setEditingTeamId(null)
    setTeamImageError('')
    setShowTeamForm(false)
    if (teamImageInputRef.current) teamImageInputRef.current.value = ''
  }
  const handleEditTeam = (m: TeamMember) => {
    setTeamForm({
      name: m.name,
      role: m.role,
      department: m.department,
      bio: m.bio || '',
      image: m.image || '',
      linkedin: m.linkedin || '',
      github: m.github || ''
    })
    setEditingTeamId(m.id)
    setTeamImageError('')
    setShowTeamForm(true)
    if (teamImageInputRef.current) teamImageInputRef.current.value = ''
  }
  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
    if (res.ok) setTeam(t => t.filter(x => x.id !== id))
  }

  const handleTeamImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setTeamImageError('Lutfen gecerli bir gorsel dosyasi secin.')
      e.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setTeamImageError('Gorsel boyutu en fazla 2 MB olabilir.')
      e.target.value = ''
      return
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file)
      setTeamForm(f => ({ ...f, image: imageDataUrl }))
      setTeamImageError('')
    } catch {
      setTeamImageError('Gorsel yuklenirken bir hata olustu.')
      e.target.value = ''
    }
  }

  const handleRemoveTeamImage = () => {
    setTeamForm(f => ({ ...f, image: '' }))
    setTeamImageError('')
    if (teamImageInputRef.current) teamImageInputRef.current.value = ''
  }

  const persistTeamOrder = async (nextTeam: TeamMember[]) => {
    const previousTeam = team
    setTeam(nextTeam)

    const res = await fetch('/api/team', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderIds: nextTeam.map((member) => member.id) })
    })

    if (!res.ok) {
      setTeam(previousTeam)
    }
  }

  const handleTeamDragStart = (memberId: string) => {
    setDraggedTeamId(memberId)
    setDragOverTeamId(memberId)
  }

  const handleTeamDrop = async (targetMemberId: string) => {
    if (!draggedTeamId || draggedTeamId === targetMemberId) {
      setDraggedTeamId(null)
      setDragOverTeamId(null)
      return
    }

    const currentIndex = team.findIndex((member) => member.id === draggedTeamId)
    const targetIndex = team.findIndex((member) => member.id === targetMemberId)

    if (currentIndex === -1 || targetIndex === -1) {
      setDraggedTeamId(null)
      setDragOverTeamId(null)
      return
    }

    const reorderedTeam = [...team]
    const [movedMember] = reorderedTeam.splice(currentIndex, 1)
    reorderedTeam.splice(targetIndex, 0, movedMember)

    setDraggedTeamId(null)
    setDragOverTeamId(null)
    await persistTeamOrder(reorderedTeam)
  }

  const handleTeamDragEnd = () => {
    setDraggedTeamId(null)
    setDragOverTeamId(null)
  }

  // ─── Event handlers ───────────────────────────────────
  const openNewEventForm = () => {
    setEventForm(emptyEventForm)
    setEditingEventId(null)
    setEventImageError('')
    setShowEventForm(true)
    if (eventImageInputRef.current) eventImageInputRef.current.value = ''
  }

  const resetEventFormState = () => {
    setEventForm(emptyEventForm)
    setEditingEventId(null)
    setEventImageError('')
    setShowEventForm(false)
    if (eventImageInputRef.current) eventImageInputRef.current.value = ''
  }

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location) return
    if (!eventForm.unlimitedCapacity && !eventForm.capacity) return
    if (editingEventId) {
      const res = await fetch(`/api/events/${editingEventId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventForm,
          capacity: eventForm.unlimitedCapacity ? 0 : parseInt(eventForm.capacity)
        })
      })
      if (res.ok) {
        const { event } = await res.json()
        setEvents(e => e.map(x => x.id === editingEventId ? event : x))
      }
    } else {
      const res = await fetch('/api/events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventForm, isActive: true })
      })
      if (res.ok) {
        const { event } = await res.json()
        setEvents(e => [...e, event])
      }
    }
    resetEventFormState()
  }
  const handleEditEvent = (ev: Event) => {
    setEventForm({
      title: ev.title, description: ev.description, image: ev.image || '', instagram: ev.instagram || '', date: ev.date,
      time: ev.time, location: ev.location, mapQuery: ev.mapQuery || '',
      type: ev.type, capacity: ev.capacity.toString(), unlimitedCapacity: ev.unlimitedCapacity === true
    })
    setEditingEventId(ev.id)
    setEventImageError('')
    setShowEventForm(true)
    if (eventImageInputRef.current) eventImageInputRef.current.value = ''
  }
  const handleToggleEvent = async (id: string, isCurrentlyActive: boolean) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isCurrentlyActive })
    })
    if (res.ok) {
      const { event } = await res.json()
      setEvents(e => e.map(x => x.id === id ? event : x))
    }
  }
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
    if (res.ok) setEvents(e => e.filter(x => x.id !== id))
  }

  const handleEventImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setEventImageError('Lutfen gecerli bir gorsel dosyasi secin.')
      e.target.value = ''
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setEventImageError('Gorsel boyutu en fazla 4 MB olabilir.')
      e.target.value = ''
      return
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file)
      setEventForm(f => ({ ...f, image: imageDataUrl }))
      setEventImageError('')
    } catch {
      setEventImageError('Gorsel yuklenirken bir hata olustu.')
      e.target.value = ''
    }
  }

  const handleRemoveEventImage = () => {
    setEventForm(f => ({ ...f, image: '' }))
    setEventImageError('')
    if (eventImageInputRef.current) eventImageInputRef.current.value = ''
  }

  const persistEventOrder = async (nextEvents: Event[]) => {
    const previousEvents = events
    setEvents(nextEvents)

    const res = await fetch('/api/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderIds: nextEvents.map((event) => event.id) })
    })

    if (!res.ok) {
      setEvents(previousEvents)
    }
  }

  const handleEventDragStart = (eventId: string) => {
    setDraggedEventId(eventId)
    setDragOverEventId(eventId)
  }

  const handleEventDrop = async (targetEventId: string) => {
    if (!draggedEventId || draggedEventId === targetEventId) {
      setDraggedEventId(null)
      setDragOverEventId(null)
      return
    }

    const currentIndex = events.findIndex((event) => event.id === draggedEventId)
    const targetIndex = events.findIndex((event) => event.id === targetEventId)

    if (currentIndex === -1 || targetIndex === -1) {
      setDraggedEventId(null)
      setDragOverEventId(null)
      return
    }

    const reorderedEvents = [...events]
    const [movedEvent] = reorderedEvents.splice(currentIndex, 1)
    reorderedEvents.splice(targetIndex, 0, movedEvent)

    setDraggedEventId(null)
    setDragOverEventId(null)
    await persistEventOrder(reorderedEvents)
  }

  const handleEventDragEnd = () => {
    setDraggedEventId(null)
    setDragOverEventId(null)
  }

  // ─── Helpers ─────────────────────────────────────────
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  const getStatusBadge = (status: Member['status']) => {
    if (status === 'pending') return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" /> Bekliyor</Badge>
    if (status === 'approved') return <Badge className="bg-green-500/10 text-green-500 gap-1"><CheckCircle className="w-3 h-3" /> Onaylandı</Badge>
    return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Reddedildi</Badge>
  }

  const pendingMembers = members.filter(m => m.status === 'pending')
  const approvedMembers = members.filter(m => m.status === 'approved')
  const unreadMessages = messages.filter(m => !m.read)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SiteLogo className="h-12 w-12 mx-auto mb-4 animate-pulse" priority />
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SiteLogo className="h-12 w-12" />
            <div>
              <h1 className="font-bold">Admin Paneli</h1>
              <p className="text-xs text-muted-foreground">Koyuya Yapay Zeka Yönetimi</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Çıkış
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} count={members.length} label="Toplam Başvuru" color="bg-primary/10 text-primary" />
          <StatCard icon={Clock} count={pendingMembers.length} label="Bekleyen" color="bg-yellow-500/10 text-yellow-500" />
          <StatCard icon={CheckCircle} count={approvedMembers.length} label="Onaylı Üye" color="bg-green-500/10 text-green-500" />
          <StatCard icon={Mail} count={unreadMessages.length} label="Okunmamış" color="bg-accent/10 text-accent" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="members" className="gap-1.5 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5" /> Üyeler
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5 text-xs sm:text-sm">
              <Mail className="w-3.5 h-3.5" /> Mesajlar
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-1.5 text-xs sm:text-sm">
              <Megaphone className="w-3.5 h-3.5" /> Ekip
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-1.5 text-xs sm:text-sm">
              <Calendar className="w-3.5 h-3.5" /> Etkinlik
            </TabsTrigger>
          </TabsList>

          {/* ── MEMBERS ─────────────────────────────────────────────── */}
          <TabsContent value="members">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle>Üyelik Başvuruları</CardTitle></CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Henüz üyelik başvurusu yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map(member => (
                      <div key={member.id} className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{member.name}</h3>
                              {getStatusBadge(member.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Ekip: <span className="font-medium text-primary">{member.team}</span>
                              {member.phone && ` • Tel: ${member.phone}`}
                            </p>
                            <p className="text-xs text-muted-foreground">Başvuru: {formatDate(member.createdAt)}</p>
                          </div>
                          <div className="flex gap-2">
                            {member.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => handleMemberStatus(member.id, 'approved')} className="gap-1 bg-green-600 hover:bg-green-700">
                                  <UserCheck className="w-3.5 h-3.5" /> Onayla
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleMemberStatus(member.id, 'rejected')} className="gap-1">
                                  <UserX className="w-3.5 h-3.5" /> Reddet
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleDeleteMember(member.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── MESSAGES ────────────────────────────────────────────── */}
          <TabsContent value="messages">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Gelen Mesajlar</CardTitle></CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Henüz mesaj yok</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          onClick={() => handleMarkAsRead(message)}
                          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                            selectedMessage?.id === message.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                          } ${!message.read ? 'bg-secondary/50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate text-sm">{message.name}</h4>
                                {!message.read && <Badge variant="secondary" className="text-xs">Yeni</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground">{message.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatDate(message.createdAt)}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={e => { e.stopPropagation(); handleMarkAsRead(message) }}>
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={e => { e.stopPropagation(); handleDeleteMessage(message.id) }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Mesaj Detayı</CardTitle></CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <div className="space-y-4">
                      <div><p className="text-xs text-muted-foreground">Gönderen</p><p className="font-medium">{selectedMessage.name}</p><p className="text-sm text-primary">{selectedMessage.email}</p></div>
                      <div><p className="text-xs text-muted-foreground">Tarih</p><p className="text-sm">{formatDate(selectedMessage.createdAt)}</p></div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Mesaj</p>
                        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                          <p className="whitespace-pre-wrap text-sm">{selectedMessage.message}</p>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => window.location.href = `mailto:${selectedMessage.email}`}>
                        <Mail className="w-4 h-4 mr-2" /> Yanıtla
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Bir mesaj seçin</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── TEAM ────────────────────────────────────────────────── */}
          <TabsContent value="team">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Ekip Yönetimi</h2>
                <Button onClick={() => { setTeamForm(emptyTeamForm); setEditingTeamId(null); setTeamImageError(''); setShowTeamForm(true); if (teamImageInputRef.current) teamImageInputRef.current.value = '' }} className="gap-2">
                  <UserPlus className="w-4 h-4" /> Üye Ekle
                </Button>
              </div>

              {team.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  Siralamayi degistirmek icin karti surukleyip baska bir ekip uyesinin ustune birak.
                </p>
              )}

              {showTeamForm && (
                <Card className="bg-card border-primary/30 border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">{editingTeamId ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Profil Fotografi</Label>
                      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-secondary/20 p-4 md:flex-row md:items-center">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                          {teamForm.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={teamForm.image} alt={`${teamForm.name || 'Ekip uyesi'} fotografi`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ImagePlus className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            ref={teamImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleTeamImageChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG veya WEBP yukleyebilirsiniz. Maksimum boyut 2 MB.
                          </p>
                          {teamImageError && (
                            <p className="text-xs text-destructive">{teamImageError}</p>
                          )}
                          {teamForm.image && (
                            <Button type="button" variant="outline" size="sm" onClick={handleRemoveTeamImage} className="gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Fotografi Kaldir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Ad Soyad *</Label>
                        <Input value={teamForm.name} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} placeholder="Adı Soyadı" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Rol *</Label>
                        <select
                          value={teamForm.role}
                          onChange={e => setTeamForm(f => ({ ...f, role: e.target.value }))}
                          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Rol secin</option>
                          {teamRoleOptions.map(role => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Bölüm *</Label>
                      <Input value={teamForm.department} onChange={e => setTeamForm(f => ({ ...f, department: e.target.value }))} placeholder="Bilgisayar Mühendisliği" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Biyografi</Label>
                      <Textarea value={teamForm.bio} onChange={e => setTeamForm(f => ({ ...f, bio: e.target.value }))} placeholder="Kısa biyografi..." rows={2} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>LinkedIn URL</Label>
                        <Input value={teamForm.linkedin} onChange={e => setTeamForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label>GitHub URL</Label>
                        <Input value={teamForm.github} onChange={e => setTeamForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/..." />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveTeam} className="gap-2"><Save className="w-4 h-4" /> Kaydet</Button>
                      <Button variant="outline" onClick={() => setShowTeamForm(false)} className="gap-2"><X className="w-4 h-4" /> İptal</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {team.map(member => (
                  <Card
                    key={member.id}
                    draggable
                    onDragStart={() => handleTeamDragStart(member.id)}
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (draggedTeamId && draggedTeamId !== member.id) setDragOverTeamId(member.id)
                    }}
                    onDrop={() => void handleTeamDrop(member.id)}
                    onDragEnd={handleTeamDragEnd}
                    className={cn(
                      'bg-card border-border cursor-grab transition-all active:cursor-grabbing',
                      draggedTeamId === member.id && 'scale-[0.98] opacity-60',
                      dragOverTeamId === member.id && draggedTeamId !== member.id && 'border-primary ring-2 ring-primary/20'
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-1 items-start gap-3">
                          <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/60">
                            {member.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                <ImagePlus className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-primary text-sm">{member.role}</p>
                            <p className="text-muted-foreground text-xs">{member.department}</p>
                            {member.bio && <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{member.bio}</p>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditTeam(member)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteTeam(member.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {team.length === 0 && !showTeamForm && (
                <div className="text-center py-12 bg-card rounded-xl border border-border text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Henüz ekip üyesi yok</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── EVENTS ──────────────────────────────────────────────── */}
          <TabsContent value="events">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Etkinlik Yönetimi</h2>
                <Button onClick={openNewEventForm} className="gap-2">
                  <CalendarPlus className="w-4 h-4" /> Etkinlik Ekle
                </Button>
              </div>

              {events.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  Siralamayi degistirmek icin etkinlik kartini surukleyip istedigin yere birak.
                </p>
              )}

              {showEventForm && (
                <Card className="bg-card border-primary/30 border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">{editingEventId ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Etkinlik Gorseli</Label>
                      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-secondary/20 p-4 md:flex-row md:items-center">
                        <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:h-28 md:w-48">
                          {eventForm.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={eventForm.image} alt={`${eventForm.title || 'Etkinlik'} gorseli`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 text-muted-foreground">
                              <div className="flex flex-col items-center gap-2 text-center">
                                <ImagePlus className="h-8 w-8" />
                                <span className="text-xs font-medium">Afis veya tasarim ekleyin</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            ref={eventImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleEventImageChange}
                          />
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG veya WEBP yukleyebilirsiniz. Maksimum boyut 4 MB.
                          </p>
                          {eventImageError && (
                            <p className="text-xs text-destructive">{eventImageError}</p>
                          )}
                          {eventForm.image && (
                            <Button type="button" variant="outline" size="sm" onClick={handleRemoveEventImage} className="gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Gorseli Kaldir
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Başlık *</Label>
                      <Input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} placeholder="Etkinlik başlığı" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Açıklama</Label>
                      <Textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} placeholder="Etkinlik açıklaması..." rows={3} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label>Tarih *</Label>
                        <Input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Saat *</Label>
                        <Input type="time" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Kontenjan</Label>
                        <div className="rounded-lg border border-input bg-background p-2">
                          <button
                            type="button"
                            onClick={() => setEventForm(f => ({ ...f, unlimitedCapacity: !f.unlimitedCapacity }))}
                            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary/60 transition-colors"
                          >
                            <span className="font-medium">
                              {eventForm.unlimitedCapacity ? 'Kontenjan Kapali' : 'Kontenjan Acik'}
                            </span>
                            {eventForm.unlimitedCapacity ? <ToggleLeft className="w-5 h-5 text-muted-foreground" /> : <ToggleRight className="w-5 h-5 text-primary" />}
                          </button>
                          {!eventForm.unlimitedCapacity ? (
                            <div className="mt-2">
                              <Input
                                type="number"
                                value={eventForm.capacity}
                                onChange={e => setEventForm(f => ({ ...f, capacity: e.target.value }))}
                                min="1"
                                placeholder="50"
                              />
                            </div>
                          ) : (
                            <p className="mt-2 px-2 text-xs text-muted-foreground">
                              Bu etkinlikte kontenjan siniri uygulanmayacak.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Konum *</Label>
                        <Input value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} placeholder="Konferans Salonu A" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Harita Arama Metni</Label>
                        <Input value={eventForm.mapQuery} onChange={e => setEventForm(f => ({ ...f, mapQuery: e.target.value }))} placeholder="Google Maps arama metni" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Instagram Post Linki</Label>
                      <Input value={eventForm.instagram} onChange={e => setEventForm(f => ({ ...f, instagram: e.target.value }))} placeholder="https://www.instagram.com/p/..." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Etkinlik Türü</Label>
                      <select
                        value={eventForm.type}
                        onChange={e => setEventForm(f => ({ ...f, type: e.target.value }))}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminer</option>
                        <option value="hackathon">Hackathon</option>
                        <option value="meetup">Buluşma</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveEvent} className="gap-2"><Save className="w-4 h-4" /> Kaydet</Button>
                      <Button variant="outline" onClick={() => setShowEventForm(false)} className="gap-2"><X className="w-4 h-4" /> İptal</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {events.map(event => (
                  <Card
                    key={event.id}
                    draggable
                    onDragStart={() => handleEventDragStart(event.id)}
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (draggedEventId && draggedEventId !== event.id) setDragOverEventId(event.id)
                    }}
                    onDrop={() => void handleEventDrop(event.id)}
                    onDragEnd={handleEventDragEnd}
                    className={cn(
                      'bg-card border-border cursor-grab transition-all active:cursor-grabbing',
                      draggedEventId === event.id && 'scale-[0.99] opacity-60',
                      dragOverEventId === event.id && draggedEventId !== event.id && 'border-primary ring-2 ring-primary/20'
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-1 items-start gap-3">
                          <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary/40">
                            {event.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 text-muted-foreground">
                                <Calendar className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant="outline" className="text-xs">{event.type}</Badge>
                            {event.isActive !== false
                              ? <Badge className="text-xs bg-green-500/10 text-green-500">Aktif</Badge>
                              : <Badge variant="outline" className="text-xs text-muted-foreground">Tamamlandi</Badge>
                            }
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {event.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('tr-TR')} • {event.time} • {event.location}
                            </p>
                            <p className="text-xs text-muted-foreground">
                            {event.unlimitedCapacity ? `${event.registered} katilimci - sinirsiz kontenjan` : `${event.registered}/${event.capacity} katılımcı`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleEvent(event.id, event.isActive !== false)}
                            className="gap-1.5 text-xs"
                          >
                            {event.isActive !== false ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                            {event.isActive !== false ? 'Tamamlandi' : 'Yeniden Aktif Et'}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditEvent(event)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {events.length === 0 && !showEventForm && (
                  <div className="text-center py-12 bg-card rounded-xl border border-border text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Henüz etkinlik yok</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Gorsel okunamadi'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Gorsel okunamadi'))
    reader.readAsDataURL(file)
  })
}
