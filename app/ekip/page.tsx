'use client'

import { useEffect, useState } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import type { TeamMember } from '@/lib/data'
import { Github, Linkedin, User } from 'lucide-react'

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => setTeam(data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-[120%] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/2 top-8 h-80 w-80 translate-x-[130%] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
              KOU AI yonetim ekibi
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">Ekibimiz</h1>
            <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
              KOU AI&apos;yi yoneten ve etkinlikleri organize eden tutkulu ekibimizle tanisin.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 pb-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="mx-auto grid max-w-7xl justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[24.5rem] w-full max-w-[21.75rem] rounded-3xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="mx-auto grid max-w-7xl justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold">Ekibimize Katilmak Ister Misiniz?</h2>
            <p className="mb-6 text-muted-foreground">
              Yonetim kadrosunda yer almak ve kulubumuzun gelisimine katkı saglamak istiyorsaniz basvurabilirsiniz.
            </p>
            <a
              href="/uyelik"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Basvuru Yap
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group w-full max-w-[21.75rem] overflow-hidden rounded-[1.75rem] border border-border/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[5/4] max-h-[18rem] overflow-hidden border-b border-border/60 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(236,72,153,0.12))]">
        {member.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#dbeafe,#f5d0fe)]">
            <User className="h-20 w-20 text-primary/80" />
          </div>
        )}
      </div>

      <div className="space-y-3.5 p-5">
        <div>
          <h3 className="text-[1.45rem] font-bold leading-tight text-foreground">{member.name}</h3>
          <p className="mt-1 text-[0.95rem] font-medium text-primary">{member.role}</p>
          <p className="mt-1 text-sm text-muted-foreground">{member.department}</p>
        </div>

        {member.bio ? (
          <p className="min-h-[3.75rem] text-sm leading-6 text-muted-foreground">{member.bio}</p>
        ) : (
          <p className="min-h-[3.75rem] text-sm leading-6 text-muted-foreground">
            KOU AI toplulugunun gelisimi icin aktif katkı sunuyor.
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all duration-200 hover:bg-primary/15 hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all duration-200 hover:bg-primary/15 hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
