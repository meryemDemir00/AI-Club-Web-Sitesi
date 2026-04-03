'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Event } from '@/lib/data'
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Coffee,
  MapPin,
  Presentation,
  Trophy,
} from 'lucide-react'

const eventTypeConfig = {
  workshop: {
    label: 'Workshop',
    icon: Code,
    chipClass: 'border-violet-500/30 bg-violet-500/10 text-violet-100',
    accentClass: 'from-violet-600 via-fuchsia-500 to-sky-500',
  },
  seminar: {
    label: 'Seminer',
    icon: Presentation,
    chipClass: 'border-sky-500/30 bg-sky-500/10 text-sky-100',
    accentClass: 'from-sky-600 via-cyan-500 to-blue-500',
  },
  hackathon: {
    label: 'Hackathon',
    icon: Trophy,
    chipClass: 'border-amber-500/30 bg-amber-500/10 text-amber-50',
    accentClass: 'from-amber-500 via-orange-500 to-rose-500',
  },
  meetup: {
    label: 'Bulusma',
    icon: Coffee,
    chipClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-50',
    accentClass: 'from-emerald-600 via-teal-500 to-cyan-500',
  },
} as const

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
  })
}

function EventVisual({ event }: { event: Event }) {
  const typeConfig = eventTypeConfig[event.type]
  const Icon = typeConfig.icon

  if (event.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
    )
  }

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${typeConfig.accentClass}`}>
      <div className="rounded-[2rem] border border-white/15 bg-black/15 p-8 backdrop-blur-md">
        <Icon className="h-12 w-12 text-white" />
      </div>
    </div>
  )
}

export function HomeEventsSlider() {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data: Event[]) => {
        const activeEvents = Array.isArray(data)
          ? data.filter((event) => event.isActive !== false).slice(0, 6)
          : []
        setEvents(activeEvents)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const node = scrollRef.current
    if (!node || events.length === 0) return

    const handleScroll = () => {
      const card = node.querySelector<HTMLElement>('[data-slider-card="true"]')
      if (!card) return
      const cardWidth = card.offsetWidth + 24
      const nextIndex = Math.round(node.scrollLeft / cardWidth)
      setActiveIndex(Math.max(0, Math.min(nextIndex, events.length - 1)))
    }

    handleScroll()
    node.addEventListener('scroll', handleScroll, { passive: true })
    return () => node.removeEventListener('scroll', handleScroll)
  }, [events.length])

  const scrollByCard = (direction: 'prev' | 'next') => {
    const node = scrollRef.current
    if (!node) return
    const card = node.querySelector<HTMLElement>('[data-slider-card="true"]')
    const cardWidth = card ? card.offsetWidth + 24 : node.clientWidth * 0.88
    node.scrollBy({
      left: direction === 'next' ? cardWidth : -cardWidth,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative overflow-hidden border-y border-border bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.98))] py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 rounded-full border-primary/25 bg-primary/10 px-4 py-1.5 text-primary">
              Etkinlik Vitrini
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Sıradaki etkinlikleri ana sayfada kaydırarak keşfet
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Admin panelinde eklediğin etkinlik afişleri burada yatay bir vitrin olarak akıyor. Kullanıcılar tek bakışta etkinlikleri gezip detay sayfasına geçebiliyor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => scrollByCard('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => scrollByCard('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Link href="/etkinlikler">
              <Button className="gap-2 rounded-full px-5">
                Tum Etkinlikler
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="h-[32rem] min-w-[86vw] animate-pulse rounded-[32px] border border-border bg-card sm:min-w-[30rem] lg:min-w-[34rem]"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {events.map((event) => {
                const typeConfig = eventTypeConfig[event.type]
                const Icon = typeConfig.icon

                return (
                  <article
                    key={event.id}
                    data-slider-card="true"
                    className="group min-w-[86vw] snap-start overflow-hidden rounded-[32px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 sm:min-w-[30rem] lg:min-w-[34rem]"
                  >
                    <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
                      <div className="relative h-80 overflow-hidden lg:h-full">
                        <EventVisual event={event} />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />
                        <div className="absolute left-5 top-5 flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-md ${typeConfig.chipClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className={`border backdrop-blur-md ${typeConfig.chipClass}`}>
                            {typeConfig.label}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-3xl font-semibold leading-tight">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col p-6">
                        <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                          {event.description}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-border bg-secondary/35 p-4">
                            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span className="text-xs uppercase tracking-[0.18em]">Tarih</span>
                            </div>
                            <p className="font-medium">{formatDate(event.date)}</p>
                          </div>
                          <div className="rounded-2xl border border-border bg-secondary/35 p-4">
                            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="text-xs uppercase tracking-[0.18em]">Saat</span>
                            </div>
                            <p className="font-medium">{event.time}</p>
                          </div>
                          <div className="rounded-2xl border border-border bg-secondary/35 p-4 sm:col-span-2">
                            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="text-xs uppercase tracking-[0.18em]">Konum</span>
                            </div>
                            <p className="line-clamp-2 font-medium">{event.location}</p>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                          <div className="flex items-center gap-2">
                            {events.map((_, index) => (
                              <span
                                key={`${event.id}-${index}`}
                                className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-border'}`}
                              />
                            ))}
                          </div>
                          <Link href="/etkinlikler">
                            <Button className="gap-2 rounded-full px-5">
                              Detaylari Gor
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        ) : (
          <div className="rounded-[32px] border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold">Yakinda yeni etkinlikler burada olacak</h3>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Admin panelinden etkinlik eklediginde ana sayfadaki slider otomatik olarak guncellenir.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
