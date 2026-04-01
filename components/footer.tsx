import Link from 'next/link'
import { SiteLogo } from '@/components/site-logo'
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <SiteLogo className="h-10 w-10" />
              <span className="font-bold text-xl">KOU AI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Yapay zeka tutkunlarinin bulusma noktasi. Birlikte ogreniyoruz, birlikte gelistiriyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Hakkimizda
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/ekip" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Ekibimiz
                </Link>
              </li>
              <li>
                <Link href="/uyelik" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Uye Ol
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Kaynaklar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/etkinlikler" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Workshop&apos;lar
                </Link>
              </li>
              <li>
                <Link href="/etkinlikler" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Seminerler
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Iletisim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Iletisim</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@kouai.edu.tr
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://www.linkedin.com/company/ai-community-kou/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/kouyapayzeka/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2026 KOU AI. Tum haklar saklidir.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
