'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Github, Linkedin, User } from 'lucide-react'
import type { TeamMember } from '@/lib/data'

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(data => setTeam(data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Ekibimiz</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Koyuya Yapay Zeka&apos;yı yöneten ve etkinlikleri organize eden tutkulu ekibimizle tanışın.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ekibimize Katılmak İster Misiniz?</h2>
            <p className="text-muted-foreground mb-6">
              Yönetim kadrosunda yer almak ve kulübümüzün gelişimine katkı sağlamak istiyorsanız başvurabilirsiniz.
            </p>
            <a
              href="/uyelik"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Başvuru Yap
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
    <div className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/40">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          boxShadow: 'inset 0 1px 0 hsl(var(--primary) / 0.3)'
        }}
      />

      <div className="relative p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
            {member.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
            {/* Ring glow on avatar */}
            <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-hover:ring-primary/40 transition-all duration-300" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary transition-colors duration-200">
              {member.name}
            </h3>
            <p className="text-primary text-sm font-medium">{member.role}</p>
            <p className="text-muted-foreground text-xs mt-0.5 truncate">{member.department}</p>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {member.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="flex gap-2 pt-3 border-t border-border">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-200"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
