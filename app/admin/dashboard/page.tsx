'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Member, ContactMessage, TeamMember, Event } from '@/lib/data'
import {
  Brain, Users, Mail, LogOut, CheckCircle, XCircle, Clock,
  Trash2, Eye, UserCheck, UserX, UserPlus, Pencil, Save,
  X, Calendar, CalendarPlus, ToggleLeft, ToggleRight, Megaphone
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type TeamForm = { name: string; role: string; department: string; bio: string; linkedin: string; github: string }
type EventForm = { title: string; description: string; date: string; time: string; location: string; mapQuery: string; type: string; capacity: string }
const emptyTeamForm: TeamForm = { name: '', role: '', department: '', bio: '', linkedin: '', github: '' }
const emptyEventForm: EventForm = { title: '', description: '', date: '', time: '', location: '', mapQuery: '', type: 'workshop', capacity: '50' }
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

  // Event form states
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)

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
    setShowTeamForm(false)
  }
  const handleEditTeam = (m: TeamMember) => {
    setTeamForm({ name: m.name, role: m.role, department: m.department, bio: m.bio || '', linkedin: m.linkedin || '', github: m.github || '' })
    setEditingTeamId(m.id)
    setShowTeamForm(true)
  }
  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) return
    const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
    if (res.ok) setTeam(t => t.filter(x => x.id !== id))
  }

  // ─── Event handlers ───────────────────────────────────
  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location) return
    if (editingEventId) {
      const res = await fetch(`/api/events/${editingEventId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventForm, capacity: parseInt(eventForm.capacity) })
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
    setEventForm(emptyEventForm)
    setEditingEventId(null)
    setShowEventForm(false)
  }
  const handleEditEvent = (ev: Event) => {
    setEventForm({
      title: ev.title, description: ev.description, date: ev.date,
      time: ev.time, location: ev.location, mapQuery: ev.mapQuery || '',
      type: ev.type, capacity: ev.capacity.toString()
    })
    setEditingEventId(ev.id)
    setShowEventForm(true)
  }
  const handleToggleEvent = async (id: string) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle' })
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
          <Brain className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
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
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
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
                <Button onClick={() => { setTeamForm(emptyTeamForm); setEditingTeamId(null); setShowTeamForm(true) }} className="gap-2">
                  <UserPlus className="w-4 h-4" /> Üye Ekle
                </Button>
              </div>

              {showTeamForm && (
                <Card className="bg-card border-primary/30 border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">{editingTeamId ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                  <Card key={member.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-primary text-sm">{member.role}</p>
                          <p className="text-muted-foreground text-xs">{member.department}</p>
                          {member.bio && <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{member.bio}</p>}
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
                <Button onClick={() => { setEventForm(emptyEventForm); setEditingEventId(null); setShowEventForm(true) }} className="gap-2">
                  <CalendarPlus className="w-4 h-4" /> Etkinlik Ekle
                </Button>
              </div>

              {showEventForm && (
                <Card className="bg-card border-primary/30 border-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">{editingEventId ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                        <Input type="number" value={eventForm.capacity} onChange={e => setEventForm(f => ({ ...f, capacity: e.target.value }))} min="1" />
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
                  <Card key={event.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            <Badge variant="outline" className="text-xs">{event.type}</Badge>
                            {event.isActive
                              ? <Badge className="text-xs bg-green-500/10 text-green-500">Aktif</Badge>
                              : <Badge variant="outline" className="text-xs text-muted-foreground">Pasif</Badge>
                            }
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('tr-TR')} • {event.time} • {event.location}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.registered}/{event.capacity} katılımcı</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleEvent(event.id)}
                            className="gap-1.5 text-xs"
                          >
                            {event.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                            {event.isActive ? 'Kapat' : 'Aç'}
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
