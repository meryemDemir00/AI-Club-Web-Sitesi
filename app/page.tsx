import Link from 'next/link'
import { HomeEventsSlider } from '@/components/home-events-slider'
import { SiteLogo } from '@/components/site-logo'
import { Button } from '@/components/ui/button'
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  Github,
  Instagram,
  Layers3,
  Linkedin,
  Mail,
  Sparkles,
  UserRound,
} from 'lucide-react'

const stats = [
  { value: '200+', label: 'Aktif Üye' },
  { value: '50+', label: 'Etkinlik' },
  { value: '12+', label: 'Proje Takımı' },
]

const managementCards = [
  {
    icon: CalendarDays,
    title: 'Etkinlik Yönetimi',
    description:
      'Admin panelinden eklenen, sıralanan ve görselleri yüklenen etkinlikler ana sayfa ve etkinlikler ekranında canlı görünür.',
  },
  {
    icon: UserRound,
    title: 'Ekip Yönetimi',
    description:
      'Ekip üyeleri fotoğrafları, sosyal medya bağlantıları ve kart sıralamalarıyla birlikte doğrudan panelden düzenlenebilir.',
  },
  {
    icon: FolderKanban,
    title: 'Dinamik İçerik',
    description:
      'Kulüp içeriği sabit bir vitrin gibi görünse de arkasında tamamen yönetilebilir bir veri akışı bulunur.',
  },
]

const quickLinks = [
  { href: '#home', label: 'Anasayfa', icon: Sparkles },
  { href: '#about', label: 'Hakkımızda', icon: UserRound },
  { href: '#system', label: 'Yönetim', icon: Layers3 },
  { href: '#events', label: 'Etkinlikler', icon: CalendarDays },
  { href: '#contact', label: 'İletişim', icon: Mail },
]

function SectionSubtitle({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span>{label}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[#1f1f1f]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(118,56,255,0.16),transparent_20%),radial-gradient(circle_at_85%_10%,rgba(25,211,161,0.12),transparent_16%),radial-gradient(circle_at_50%_75%,rgba(255,255,255,0.04),transparent_30%)]" />

      <div className="mx-auto max-w-[1500px] px-4 py-4 md:px-6 xl:grid xl:grid-cols-[340px_minmax(0,1fr)] xl:gap-8 xl:px-8 xl:py-8">
        <aside className="xl:sticky xl:top-8 xl:h-fit">
          <div className="rounded-[30px] border border-[#565656] bg-[#1f1f1f]/95 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-md md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="rounded-full border border-white/12 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
                Kocaeli Üniversitesi Yapay Zekâ Kulübü
              </span>
            </div>

            <div className="mx-auto flex h-[210px] w-full max-w-[220px] items-center justify-center overflow-hidden rounded-[26px] border border-white/10 bg-black/20 p-5">
              <SiteLogo className="h-full w-full" priority />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-white/35">KOU AI</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Yapay Zekâ Kulübü</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Eğitim, etkinlik, ekip çalışması ve üretim kültürünü aynı çatı altında buluşturan öğrenci topluluğu.
              </p>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-4 text-center">
                  <div className="text-xl font-semibold text-white">{item.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/38">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-center gap-3">
              <a
                href="https://www.linkedin.com/company/ai-community-kou/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/kouyapayzeka/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-white/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Link href="/uyelik">
                <Button className="h-12 w-full rounded-full text-base">Üye Ol</Button>
              </Link>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-white/15 bg-transparent text-white hover:bg-white/8 hover:text-white"
                >
                  Admin Paneli
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 pt-8 xl:pt-0">
          <div className="ml-auto max-w-[880px] space-y-24">
            <section id="home" className="pt-4 md:pt-8">
              <SectionSubtitle icon={Sparkles} label="Anasayfa" />
              <div className="max-w-[760px]">
                <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Kocaeli Üniversitesi
                  <span className="mt-2 block text-primary">Yapay Zekâ Kulübü</span>
                </h1>
                <p className="mt-8 max-w-[700px] text-base leading-8 text-white/62 md:text-lg">
                  Yapay zekâya ilgi duyan öğrencileri bir araya getiriyor; etkinlikler, ekip çalışmaları ve uygulamalı
                  üretim alanlarıyla yaşayan bir topluluk deneyimi sunuyoruz.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/etkinlikler">
                  <Button className="h-12 rounded-full px-7 text-base">
                    Etkinlikleri Gör
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/ekip">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-white/15 bg-transparent px-7 text-base text-white hover:bg-white/8 hover:text-white"
                  >
                    Ekibimizi İncele
                  </Button>
                </Link>
              </div>

              <div className="mt-14 flex flex-wrap items-end gap-8">
                {stats.map((item) => (
                  <div key={item.label}>
                    <div className="text-5xl font-semibold leading-none text-primary">{item.value}</div>
                    <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/42">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14">
                <a
                  href="#events"
                  className="inline-flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/70 transition-colors hover:border-primary hover:text-primary"
                >
                  <div className="text-center">
                    <ArrowDown className="mx-auto h-5 w-5" />
                    <span className="mt-2 block text-[10px] uppercase tracking-[0.22em]">Etkinlikler</span>
                  </div>
                </a>
              </div>
            </section>

            <section id="about">
              <SectionSubtitle icon={UserRound} label="Hakkımızda" />
              <div className="max-w-[780px]">
                <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                  Her güçlü topluluk, daha iyi bir öğrenme kültürü ve birlikte üretme isteğiyle büyür.
                </h2>
                <p className="mt-7 text-base leading-8 text-white/62 md:text-lg">
                  KOU AI; farklı bölümlerden öğrencileri yapay zekâ ekseninde buluşturarak eğitim, araştırma, üretim
                  ve paylaşım alanlarında kalıcı bir topluluk yapısı kurmayı hedefler. Kulüp yapımız yalnızca vitrin
                  değil, arkasında yönetilebilir ve sürekli güncellenebilir bir sistem taşır.
                </p>
              </div>
            </section>

            <section id="system">
              <SectionSubtitle icon={Layers3} label="Yönetim Altyapısı" />
              <div className="max-w-[760px]">
                <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Referans tasarım korunurken içerik tarafı tamamen dinamik çalışır.
                </h2>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {managementCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-[28px] border border-[#565656] bg-[#242424] p-6 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-black/20">
                      <card.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/58">{card.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="events">
              <HomeEventsSlider />
            </section>

            <section id="contact" className="pb-8">
              <SectionSubtitle icon={Mail} label="İletişim" />
              <div className="rounded-[34px] border border-[#565656] bg-[#242424] p-7 md:p-10">
                <h2 className="max-w-[720px] text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Kulübe katılmak, etkinlikleri takip etmek veya proje ekiplerinde yer almak için bizimle iletişime geçin.
                </h2>
                <p className="mt-6 max-w-[700px] text-base leading-8 text-white/60">
                  Ön yüz referans tasarımın güçlü hissini taşırken; üyelik, etkinlik, ekip ve yönetim akışları sizin
                  paneliniz üzerinden canlı olarak yönetilmeye devam eder.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/iletisim">
                    <Button className="h-12 rounded-full px-7 text-base">İletişim Formu</Button>
                  </Link>
                  <a
                    href="mailto:info@kouai.edu.tr"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 text-base text-white/82 transition-colors hover:border-primary hover:text-primary"
                  >
                    info@kouai.edu.tr
                  </a>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <nav className="fixed right-7 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
        <div className="flex flex-col gap-4 rounded-[30px] border border-[#565656] bg-[#1f1f1f]/95 px-3 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-md">
          {quickLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-primary hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-white/10 bg-[#252525] px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
