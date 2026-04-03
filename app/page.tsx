import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { HomeEventsSlider } from '@/components/home-events-slider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Sparkles, 
  Users, 
  Calendar, 
  Code, 
  Lightbulb, 
  Rocket, 
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: Code,
    title: 'Teknik Workshoplar',
    description: 'Python, TensorFlow, PyTorch ve daha fazlasini uygulamali olarak ogrenin.'
  },
  {
    icon: Users,
    title: 'Networking',
    description: 'Ayni tutkuyu paylasan ogrenciler ve sektorden profesyonellerle tanisın.'
  },
  {
    icon: Lightbulb,
    title: 'Projeler',
    description: 'Gercek dunya problemlerine AI tabanli cozumler gelistirin.'
  },
  {
    icon: Calendar,
    title: 'Etkinlikler',
    description: 'Hackathonlar, seminerler ve sosyal bulusmalarla surekli gelisim.'
  }
]

const stats = [
  { value: '200+', label: 'Aktif Uye' },
  { value: '50+', label: 'Etkinlik' },
  { value: '15+', label: 'Proje' },
  { value: '3', label: 'Yil' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">2026 Bahar Donemi Basliyor</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              Yapay Zekanin
              <span className="block text-primary">Gucunu Kesfedin</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              KOU AI olarak, yapay zeka tutkunlarini bir araya getiriyor, ogrenme ve gelistirme firsatlari sunuyoruz. Gelecegi birlikte sekillendiriyoruz.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/uyelik">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
                  Uye Ol
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/etkinlikler">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Etkinlikleri Gor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neler Yapiyoruz?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Farkli ilgi alanlarini ve seviyeleri kapsayan genis bir etkinlik yelpazesi sunuyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HomeEventsSlider />

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hazir Misiniz?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Yapay zeka dunyasina adim atin. Kulubumize katilarak ogrenme yolculugunuza baslayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/uyelik">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
                  Hemen Uye Ol
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/hakkimizda">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  Daha Fazla Bilgi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
