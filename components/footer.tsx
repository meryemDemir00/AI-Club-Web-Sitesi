import Link from 'next/link'
import { Brain, Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl">AI Club</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Yapay zeka tutkunlarinin bulusma noktasi. Birlikte ogreniyoruz, birlikte gelistiriyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Hizli Erisim</h4>
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
                info@aiclub.edu.tr
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2026 AI Club. Tum haklar saklidir.
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
