'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Event } from '@/lib/data'
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Coffee,
  MapPin,
  Presentation,
  Trophy,
} from 'lucide-react'

const eventTypeConfig = {
  workshop: {
    label: 'Workshop',
    icon: Code2,
    chipClass: 'border-violet-400/20 bg-violet-500/12 text-violet-100',
    accentClass: 'from-violet-700 via-fuchsia-600 to-slate-950',
  },
  seminar: {
    label: 'Seminer',
    icon: Presentation,
    chipClass: 'border-sky-400/20 bg-sky-500/12 text-sky-100',
    accentClass: 'from-sky-700 via-cyan-600 to-slate-950',
  },
  hackathon: {
    label: 'Hackathon',
    icon: Trophy,
    chipClass: 'border-amber-400/20 bg-amber-500/12 text-amber-100',
    accentClass: 'from-amber-600 via-orange-500 to-slate-950',
  },
  meetup: {
    label: 'Buluşma',
    icon: Coffee,
    chipClass: 'border-emerald-400/20 bg-emerald-500/12 text-emerald-100',
    accentClass: 'from-emerald-700 via-teal-600 to-slate-950',
  },
} as const

function formatDate(date: string) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
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
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-b ${typeConfig.accentClass}`}>
      <div className="rounded-[2rem] border border-white/12 bg-black/15 p-8 backdrop-blur-md">
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
      const gap = 24
      const nextIndex = Math.round(node.scrollLeft / (card.offsetWidth + gap))
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
    const width = card ? card.offsetWidth + 24 : node.clientWidth * 0.9

    node.scrollBy({
      left: direction === 'next' ? width : -width,
      behavior: 'smooth',
    })
  }

  return (
    <div className="space-y-9">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[720px]">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Etkinlikler</span>
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
            Yönetim panelinden beslenen etkinlik vitrini.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/60">
            Bu alan referans tasarımın karanlık vitrin hissini korur; ancak içerikler admin panelinden eklendiği ve
            sıralandığı için tamamen dinamik çalışır.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard('prev')}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard('next')}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link href="/etkinlikler">
            <Button className="h-12 rounded-full px-6">
              Tüm Etkinlikler
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="h-[28rem] min-w-[84vw] animate-pulse rounded-[30px] border border-[#565656] bg-[#242424] sm:min-w-[31rem]"
            />
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {events.map((event) => {
              const typeConfig = eventTypeConfig[event.type]
              const Icon = typeConfig.icon

              return (
                <article
                  key={event.id}
                  data-slider-card="true"
                  className="group min-w-[84vw] snap-start overflow-hidden rounded-[30px] border border-[#565656] bg-[#242424] transition-transform duration-300 hover:-translate-y-1 sm:min-w-[31rem] xl:min-w-[35rem]"
                >
                  <div className="relative h-[340px] overflow-hidden">
                    <EventVisual event={event} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute left-5 top-5 flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md ${typeConfig.chipClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs ${typeConfig.chipClass}`}>{typeConfig.label}</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="max-w-[70%] text-3xl font-semibold leading-tight text-white">{event.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="line-clamp-3 text-sm leading-7 text-white/60">{event.description}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 px-4 py-4">
                        <div className="mb-2 flex items-center gap-2 text-white/40">
                          <Calendar className="h-4 w-4" />
                          <span className="text-[11px] uppercase tracking-[0.22em]">Tarih</span>
                        </div>
                        <p className="font-medium text-white">{formatDate(event.date)}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 px-4 py-4">
                        <div className="mb-2 flex items-center gap-2 text-white/40">
                          <Clock className="h-4 w-4" />
                          <span className="text-[11px] uppercase tracking-[0.22em]">Saat</span>
                        </div>
                        <p className="font-medium text-white">{event.time}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 px-4 py-4 sm:col-span-2">
                        <div className="mb-2 flex items-center gap-2 text-white/40">
                          <MapPin className="h-4 w-4" />
                          <span className="text-[11px] uppercase tracking-[0.22em]">Konum</span>
                        </div>
                        <p className="line-clamp-2 font-medium text-white">{event.location}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {events.map((_, index) => (
                          <span
                            key={`${event.id}-${index}`}
                            className={`h-2 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-white/18'}`}
                          />
                        ))}
                      </div>

                      <Link href="/etkinlikler">
                        <Button className="rounded-full px-5">
                          Detayları Gör
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      ) : (
        <div className="rounded-[30px] border border-dashed border-white/15 bg-[#242424] px-6 py-14 text-center">
          <h3 className="text-2xl font-semibold text-white">Yakında yeni etkinlikler burada yer alacak</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/58">
            Admin panelinden yeni etkinlik eklediğinizde bu vitrin otomatik olarak güncellenir.
          </p>
        </div>
      )}
    </div>
  )
}
