'use client'

import { useEffect, useState } from 'react'
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
  ArrowRight,
  Calendar,
  Clock,
  Code,
  Coffee,
  ExternalLink,
  ImagePlus,
  Instagram,
  MapPin,
  Presentation,
  Trophy,
  Users,
} from 'lucide-react'

const eventTypeConfig = {
  workshop: {
    label: 'Workshop',
    icon: Code,
    chipClass: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
    accentClass: 'from-violet-600/80 via-fuchsia-500/70 to-sky-500/70',
    softClass: 'border-violet-400/45 bg-violet-500/12 text-violet-700 hover:border-violet-500 hover:bg-violet-500/18',
  },
  seminar: {
    label: 'Seminer',
    icon: Presentation,
    chipClass: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
    accentClass: 'from-sky-600/80 via-cyan-500/70 to-blue-500/70',
    softClass: 'border-sky-400/45 bg-sky-500/12 text-sky-700 hover:border-sky-500 hover:bg-sky-500/18',
  },
  hackathon: {
    label: 'Hackathon',
    icon: Trophy,
    chipClass: 'border-amber-500/30 bg-amber-500/10 text-amber-100',
    accentClass: 'from-amber-500/80 via-orange-500/70 to-rose-500/70',
    softClass: 'border-amber-400/50 bg-amber-500/12 text-amber-700 hover:border-amber-500 hover:bg-amber-500/18',
  },
  meetup: {
    label: 'Bulusma',
    icon: Coffee,
    chipClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100',
    accentClass: 'from-emerald-600/80 via-teal-500/70 to-cyan-500/70',
    softClass: 'border-emerald-400/45 bg-emerald-500/12 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-500/18',
  },
} as const

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getRemainingText(event: Event) {
  const eventDate = new Date(`${event.date}T${event.time || '00:00'}:00`)
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  const dayDiff = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (event.isActive === false) return 'Tamamlandi'
  if (dayDiff < 0) return 'Yakinda arsivlenecek'
  if (dayDiff === 0) return 'Bugun'
  if (dayDiff === 1) return '1 gun kaldi'
  return `${dayDiff} gun kaldi`
}

function getCapacityText(event: Event) {
  if (event.unlimitedCapacity) {
    return 'Katilim siniri yoktur'
  }

  return `${event.registered}/${event.capacity} katilimci`
}

function getProgress(event: Event) {
  if (event.unlimitedCapacity || event.capacity <= 0) return 0
  return Math.min((event.registered / event.capacity) * 100, 100)
}

function EventPoster({ event, className = '' }: { event: Event; className?: string }) {
  const typeConfig = eventTypeConfig[event.type]
  const Icon = typeConfig.icon

  if (event.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={event.image} alt={event.title} className={`h-full w-full object-cover ${className}`} />
    )
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${typeConfig.accentClass} ${className}`}>
      <div className="rounded-3xl border border-white/15 bg-black/10 p-6 backdrop-blur-sm">
        <Icon className="h-12 w-12 text-white" />
      </div>
    </div>
  )
}

function EventCard({ event, onDetail }: { event: Event; onDetail: (event: Event) => void }) {
  const typeConfig = eventTypeConfig[event.type]
  const Icon = typeConfig.icon
  const isCompleted = event.isActive === false
  const progress = getProgress(event)

  return (
    <article className={`group overflow-hidden rounded-[28px] border border-border bg-card shadow-sm transition-all duration-300 ${isCompleted ? 'opacity-70' : 'hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10'}`}>
      <div className="relative h-64 overflow-hidden">
        <EventPoster event={event} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-md ${typeConfig.chipClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="outline" className={`border backdrop-blur-md ${typeConfig.chipClass}`}>
            {typeConfig.label}
          </Badge>
        </div>

        <div className="absolute right-4 top-4">
          <Badge variant="outline" className={isCompleted ? 'border-white/15 bg-black/40 text-white/70 backdrop-blur-md' : 'border-white/15 bg-black/35 text-white backdrop-blur-md'}>
            {isCompleted ? 'Tamamlandi' : getRemainingText(event)}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-2xl font-semibold leading-tight drop-shadow-sm">
            {event.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {event.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-border bg-secondary/35 p-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Tarih</span>
            </div>
            <p className="font-medium">{formatDate(event.date)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/35 p-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Saat</span>
            </div>
            <p className="font-medium">{event.time}</p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/35 p-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Konum</span>
            </div>
            <p className="line-clamp-2 font-medium">{event.location}</p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/35 p-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.18em]">Katilim</span>
            </div>
            <p className="font-medium">{getCapacityText(event)}</p>
          </div>
        </div>

        <div className="mt-5 min-h-[3.75rem]">
          {!isCompleted && !event.unlimitedCapacity ? (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {event.capacity - event.registered <= 0 ? 'Kontenjan doldu' : `${event.capacity - event.registered} yer kaldi`}
              </p>
            </div>
          ) : null}
        </div>

        <Button className="mt-auto w-full gap-2 rounded-2xl" variant={isCompleted ? 'outline' : 'default'} onClick={() => onDetail(event)}>
          Detaylari Goruntule
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </article>
  )
}

function EventDetailModal({ event, onClose }: { event: Event | null; onClose: () => void }) {
  if (!event) return null

  const typeConfig = eventTypeConfig[event.type]
  const Icon = typeConfig.icon
  const isCompleted = event.isActive === false
  const progress = getProgress(event)
  const hasInstagramLink = Boolean(event.instagram?.trim())
  const mapQuery = event.mapQuery || event.location
  const mapsEmbedUrl = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=15`
    : null

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="h-[92vh] w-[95vw] max-w-[95vw] overflow-y-auto border-border bg-card p-0 sm:max-w-[95vw] md:w-[92vw] md:max-w-[92vw] lg:w-[88vw] lg:max-w-[88vw] xl:w-[1180px] xl:max-w-[1180px]">
        <div className="relative h-80 overflow-hidden sm:h-[26rem]">
          <EventPoster event={event} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
          <div className="absolute left-6 top-6 flex flex-wrap items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur-md ${typeConfig.chipClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className={`border backdrop-blur-md ${typeConfig.chipClass}`}>
              {typeConfig.label}
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-black/35 text-white backdrop-blur-md">
              {isCompleted ? 'Tamamlanmis Etkinlik' : getRemainingText(event)}
            </Badge>
          </div>

          <DialogHeader className="absolute bottom-0 left-0 right-0 p-6 text-left">
            <DialogTitle className="max-w-3xl text-3xl font-semibold leading-tight text-white">
              {event.title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6 lg:p-8">
          <p className="max-w-4xl text-base leading-7 text-muted-foreground">
            {event.description}
          </p>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border bg-secondary/35 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Tarih</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/35 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Saat</p>
              <p className="font-medium">{event.time}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/35 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Konum</p>
              <p className="font-medium">{event.location}</p>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/35 p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Katilim</p>
              <p className="font-medium">{getCapacityText(event)}</p>
            </div>
          </div>

          {!event.unlimitedCapacity && (
            <div className="space-y-2 rounded-3xl border border-border bg-secondary/20 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Doluluk orani</span>
                <span className="font-medium">%{Math.round(progress)}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            {isCompleted ? (
              <Button className="w-full rounded-2xl sm:flex-1" variant="outline" disabled>
                Etkinlik Tamamlandi
              </Button>
            ) : !event.unlimitedCapacity && event.registered >= event.capacity ? (
              <Button className="w-full rounded-2xl sm:flex-1" variant="secondary" size="lg" disabled>
                Kontenjan Doldu
              </Button>
            ) : (
              <Button className="w-full rounded-2xl sm:flex-1" size="lg">
                Kayit Ol
              </Button>
            )}

            {hasInstagramLink && (
              <Button asChild variant="outline" size="lg" className="rounded-2xl">
                <a href={event.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${event.title} Instagram postu`}>
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </Button>
            )}
          </div>

          {mapsEmbedUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  Konum
                </div>
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Google Maps&apos;ta Ac
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="overflow-hidden rounded-3xl border border-border">
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${event.title} konumu`}
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EventSection({
  title,
  description,
  events,
  onDetail,
  isLoading,
}: {
  title: string
  description: string
  events: Event[]
  onDetail: (event: Event) => void
  isLoading: boolean
}) {
  return (
    <section className="pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-[32rem] animate-pulse rounded-[28px] border border-border bg-card" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onDetail={onDetail} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <ImagePlus className="mx-auto mb-4 h-12 w-12 text-muted-foreground/60" />
            <h3 className="text-lg font-semibold">Henuz etkinlik yok</h3>
            <p className="mt-2 text-sm text-muted-foreground">Yeni etkinlik tasarimlari eklendiginde burada gorunecek.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<Event['type'] | 'all'>('all')

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredEvents = selectedFilter === 'all'
    ? events
    : events.filter((event) => event.type === selectedFilter)

  const activeEvents = filteredEvents.filter((event) => event.isActive !== false)
  const completedEvents = filteredEvents.filter((event) => event.isActive === false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pb-16 pt-32">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_48%),radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.14),transparent_32%)]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-5 rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              Etkinlik Vitrini
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Tasarimlarini yukledigin etkinlikler burada one ciksin
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Afis, duyuru tasarimi veya etkinlik kapagi ekleyin. Her etkinlik artik kendi gorseliyle daha guclu ve daha profesyonel gorunuyor.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors ${selectedFilter === 'all' ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'border-border bg-background/80 text-foreground hover:border-primary/30 hover:text-primary'}`}
            >
              Tumu
            </button>
            {Object.entries(eventTypeConfig).map(([key, config]) => {
              const Icon = config.icon
              const isSelected = selectedFilter === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedFilter((current) => current === key ? 'all' : key as Event['type'])}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors ${isSelected ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : config.softClass}`}
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <EventSection
        title="Aktif Etkinlikler"
        description="Admin panelinde surukleyip biraktigin sira burada korunur. Bu alan yeni etkinlik posterlerini sergilemek icin hazirlandi."
        events={activeEvents}
        onDetail={setSelectedEvent}
        isLoading={isLoading}
      />

      {completedEvents.length > 0 && (
        <section className="border-t border-border bg-card/20 py-16">
          <EventSection
            title="Tamamlanan Etkinlikler"
            description="Gecmis etkinlikleri de afisleriyle birlikte arsivleyebilirsin."
            events={completedEvents}
            onDetail={setSelectedEvent}
            isLoading={false}
          />
        </section>
      )}

      <Footer />

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
