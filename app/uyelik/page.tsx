'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  UserPlus,
  CheckCircle,
  Users,
  Megaphone,
  Wrench,
  BookOpen,
  Calendar,
  Palette
} from 'lucide-react'

const teams = [
  {
    id: 'uye-yonetimi',
    label: 'Üye Yönetimi',
    icon: Users,
    description: 'Üyelik süreçleri ve topluluk yönetimi'
  },
  {
    id: 'sosyal-medya',
    label: 'Sosyal Medya',
    icon: Megaphone,
    description: 'İçerik üretimi ve dijital iletişim'
  },
  {
    id: 'teknik',
    label: 'Teknik Ekip',
    icon: Wrench,
    description: 'Yazılım, altyapı ve teknik projeler'
  },
  {
    id: 'egitim',
    label: 'Eğitim',
    icon: BookOpen,
    description: 'Workshop, seminer ve eğitim planlaması'
  },
  {
    id: 'etkinlik',
    label: 'Etkinlik',
    icon: Calendar,
    description: 'Organizasyon ve lojistik planlama'
  },
  {
    id: 'tasarim',
    label: 'Tasarım',
    icon: Palette,
    description: 'Görsel tasarım ve marka kimliği'
  }
]

export default function ApplicationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    team: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.team) {
      setError('Lütfen bir ekip seçiniz.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Üye Ol</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Koyuya Yapay Zeka ailesine katılın. İlgi alanınıza uygun ekibinizi seçerek başvurunuzu gönderin.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle>Başvuru Formu</CardTitle>
                <CardDescription>
                  Aşağıdaki formu doldurun ve katılmak istediğiniz ekibi seçin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Başvurunuz Alındı!</h3>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                      Başvurunuz başarıyla iletildi. Ekibimiz en kısa sürede sizinle iletişime geçecek.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Ana Sayfaya Dön
                      </Button>
                      <Button onClick={() => window.location.href = '/etkinlikler'}>
                        Etkinliklere Göz At
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-widest">
                        Kişisel Bilgiler
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ad *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Adınız"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Soyad *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Soyadınız"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ornek@email.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon <span className="text-muted-foreground">(opsiyonel)</span></Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0555 123 45 67"
                        />
                      </div>
                    </div>

                    {/* Team Selection */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div>
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-widest mb-1">
                          Ekip Seçimi *
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Katılmak istediğiniz ekibi seçin:
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {teams.map((team) => {
                          const Icon = team.icon
                          const isSelected = formData.team === team.id
                          return (
                            <button
                              type="button"
                              key={team.id}
                              onClick={() => setFormData({ ...formData, team: team.id })}
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                                isSelected
                                  ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                                  : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : ''}`}>
                                  {team.label}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground ml-11">
                                {team.description}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {error && (
                      <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full gap-2 h-11"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Gönderiliyor...
                        </span>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Başvuruyu Gönder
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Başvurunuz yönetim ekibi tarafından incelenecek ve onaylandıktan sonra e-posta ile bilgilendirileceksiniz.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
