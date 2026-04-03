import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  BookOpen, 
  Lightbulb, 
  Award,
  CheckCircle
} from 'lucide-react'

const values = [
  {
    icon: Users,
    title: 'Topluluk',
    description: 'Birlikte öğrenmenin, üretmenin ve dayanışma içinde büyümenin gücüne inanıyoruz.'
  },
  {
    icon: BookOpen,
    title: 'Sürekli Öğrenme',
    description: 'Hızla gelişen yapay zekâ dünyasını yakından takip ediyor, kendimizi her gün daha ileri taşıyoruz.'
  },
  {
    icon: Lightbulb,
    title: 'İnovasyon',
    description: 'Yaratıcı fikirleri destekliyor, yenilikçi çözümler üretmeyi kulüp kültürümüzün merkezine koyuyoruz.'
  },
  {
    icon: Heart,
    title: 'Teknik Ekip',
    description: 'Her seviyeden ve her bölümden üyelerimizle iş birliği yapıyor, güçlü ekipler oluşturarak projeler geliştiriyoruz.'
  }
]

const milestones = [
  { year: '2023', title: 'Kulup Kuruldu', description: '15 kurucu uye ile yolculugumuz basladi.' },
  { year: '2024', title: 'Ilk Hackathon', description: '50 katilimci ile basarili bir etkinlik duzenlendi.' },
  { year: '2024', title: '100 Uye', description: 'Toplulugumuz 100 uye sayisina ulasti.' },
  { year: '2025', title: 'Universite Isbirligi', description: 'Resmi kulup statusu ve kaynak destegi aldik.' },
  { year: '2026', title: '200+ Uye', description: 'Buyuyen ailemiz ile yeni hedeflere kosuyoruz.' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Biz Kimiz?</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
             Kocaeli Üniversitesi'nin yapay zeka devrimine yön veren gücü! Sadece teknolojiyi konuşan değil, birlikte öğrenen, gelişen ve geleceği üreten bir topluluk inşa ediyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Misyonumuz</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Yapay zeka ekosistemine teknik becerisi yüksek, yenilikçi ve etik değerlerin farkında yetenekler kazandırmak. Düzenlediğimiz eğitimler, hackathonlar ve atölyelerle üniversitemizde kalıcı bir teknoloji kültürü inşa etmek.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Vizyonumuz</h2>
                <p className="text-muted-foreground leading-relaxed">
                 Yalnızca üniversitemizin değil, Türkiye'nin en inovatif öğrenci topluluğu olarak anılmak; mezunlarımızın 'KOU AI' kültürünü ve çalışma disiplinini tüm sektöre taşımasını sağlamak.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bizi Biz Yapan Değerler</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              KOU AI kültürünü oluşturan, adımlarımıza yön veren ve bizi bir arada tutan temel ilkelerimiz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Yolculugumuz</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Kucuk bir grup olarak basladik, simdi buyuk bir aileyiz.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="text-sm font-medium text-primary mb-1">{milestone.year}</div>
                    <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Neler Sunuyoruz?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Uygulamali Egitimler</h4>
                    <p className="text-muted-foreground text-sm">Haftalik workshop&apos;lar ve hands-on coding session&apos;lari</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Sektor Baglantilari</h4>
                    <p className="text-muted-foreground text-sm">Teknoloji firmalarindan konusmaci ve mentor destegi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Proje Destegi</h4>
                    <p className="text-muted-foreground text-sm">Kendi AI projelerinizi gelistirmek icin kaynak ve rehberlik</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Yarisma Katilimi</h4>
                    <p className="text-muted-foreground text-sm">Ulusal ve uluslararasi AI yarismalarina takim olarak katilim</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold">Networking</h4>
                    <p className="text-muted-foreground text-sm">Ayni tutkuyu paylasan ogrencilerle baglanti kurma firsati</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-border p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">3+</div>
                  <div className="text-xl font-medium mb-1">Yillik Deneyim</div>
                  <p className="text-muted-foreground text-sm">
                    Yuzlerce etkinlik ve proje ile buyuyen topluluk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
