'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Event } from '@/lib/data'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Code,
  Presentation,
  Trophy,
  Coffee,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

const eventTypeConfig = {
  workshop: { label: 'Workshop', icon: Code, color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  seminar: { label: 'Seminer', icon: Presentation, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  hackathon: { label: 'Hackathon', icon: Trophy, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  meetup: { label: 'Bulusma', icon: Coffee, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function EventCard({ event, onDetail }: { event: Event; onDetail: (e: Event) => void }) {
  const typeConfig = eventTypeConfig[event.type]
  const Icon = typeConfig.icon
  const isCompleted = new Date(event.date) < new Date()
  const isPassive = event.isActive === false
  const cardStateClass = isCompleted && isPassive
    ? 'bg-muted/50 opacity-45 saturate-[0.35] grayscale-[0.5]'
    : isCompleted
      ? 'bg-muted/40 opacity-55 saturate-50 grayscale-[0.25]'
      : isPassive
        ? 'bg-muted/30 opacity-65 saturate-[0.6] grayscale-[0.35]'
        : 'hover:shadow-xl hover:shadow-primary/10'

  return (
    <div
      className={`group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 flex flex-col ${cardStateClass}`}
    >
      <div
        className={`h-0.5 w-full ${
          isCompleted || isPassive
            ? 'bg-border/70'
            : 'bg-gradient-to-r from-primary/60 via-primary to-primary/60'
        } group-hover:opacity-100 transition-opacity`}
      />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%)' }}
      />

      <div className="relative p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className={`w-11 h-11 rounded-xl border ${typeConfig.color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className={`text-xs ${typeConfig.color}`}>
              {typeConfig.label}
            </Badge>
            {!event.isActive && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Pasif
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Tamamlanmis
              </Badge>
            )}
          </div>
        </div>

        <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>{event.registered}/{event.capacity} Katilimci</span>
          </div>
        </div>

        {!isCompleted && !isPassive && (
          <div className="mb-4">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {event.capacity - event.registered <= 0
                ? 'Kontenjan doldu'
                : `${event.capacity - event.registered} yer kaldi`}
            </p>
          </div>
        )}

        <Button
          className="w-full gap-2 group/btn"
          variant={isCompleted || isPassive ? 'outline' : 'default'}
          onClick={() => onDetail(event)}
        >
          <span>Detaylari Goruntule</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}

function EventDetailModal({ event, onClose }: { event: Event | null; onClose: () => void }) {
  if (!event) return null

  const typeConfig = eventTypeConfig[event.type]
  const Icon = typeConfig.icon
  const isCompleted = new Date(event.date) < new Date()
  const isPassive = event.isActive === false

  const mapQuery = event.mapQuery || event.location
  const mapsEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=15`
    : null

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl border ${typeConfig.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <Badge variant="outline" className={`text-xs ${typeConfig.color}`}>
              {typeConfig.label}
            </Badge>
            {isPassive && <Badge variant="outline" className="text-xs">Pasif Etkinlik</Badge>}
            {isCompleted && <Badge variant="outline" className="text-xs">Tamamlanmis Etkinlik</Badge>}
          </div>
          <DialogTitle className="text-xl font-bold text-left">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <p className="text-muted-foreground leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Tarih</p>
                <p className="text-sm font-medium">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Saat</p>
                <p className="text-sm font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Konum</p>
                <p className="text-sm font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Katilimci</p>
                <p className="text-sm font-medium">{event.registered} / {event.capacity}</p>
              </div>
            </div>
          </div>

          {mapsEmbedUrl && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Konum
                </p>
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Google Maps&apos;ta Ac
                </a>
              </div>
              <div className="rounded-xl overflow-hidden border border-border h-48">
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${event.title} konumu`}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Doluluk Orani</span>
              <span className="font-medium">
                {Math.round((event.registered / event.capacity) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
              />
            </div>
          </div>

          {!isCompleted && !isPassive && event.registered < event.capacity && (
            <Button className="w-full" size="lg">
              Kayit Ol
            </Button>
          )}
          {!isCompleted && !isPassive && event.registered >= event.capacity && (
            <Button className="w-full" size="lg" variant="secondary" disabled>
              Kontenjan Doldu
            </Button>
          )}
          {isPassive && (
            <Button className="w-full" size="lg" variant="secondary" disabled>
              Etkinlik Pasif
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => setEvents(data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const activeEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const completedEvents = events
    .filter(e => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Etkinlikler</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Workshop&apos;lardan hackathon&apos;lara, seminerlerden bulusmalara, ogrenme firsatlarini kacirmayin.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(eventTypeConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${config.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Aktif Etkinlikler</h2>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : activeEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map(event => (
                <EventCard key={event.id} event={event} onDetail={setSelectedEvent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aktif etkinlik bulunmuyor</h3>
              <p className="text-muted-foreground text-sm">Yeni etkinlikler icin bizi takip etmeye devam edin.</p>
            </div>
          )}
        </div>
      </section>

      {completedEvents.length > 0 && (
        <section className="py-16 border-t border-border bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Tamamlanmis Etkinlikler</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map(event => (
                <EventCard key={event.id} event={event} onDetail={setSelectedEvent} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
