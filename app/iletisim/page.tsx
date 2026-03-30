'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Mail,
  Send,
  CheckCircle,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  MessageCircle
} from 'lucide-react'

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-500 hover:border-pink-500/50' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-500 hover:border-blue-500/50' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter / X', color: 'hover:text-sky-400 hover:border-sky-400/50' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-500 hover:border-red-500/50' },
  { icon: MessageCircle, href: 'https://discord.com', label: 'Discord', color: 'hover:text-indigo-400 hover:border-indigo-400/50' }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'İletişim Formu Mesajı',
          message: formData.message
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        setError('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sorularınız veya önerileriniz için bize ulaşın; en kısa sürede yanıt vereceğiz.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Bize Mesaj Gönderin</CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Mesajınız Gönderildi!</h3>
                    <p className="text-muted-foreground mb-6">
                      En kısa sürede size dönüş yapacağız.
                    </p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                      Yeni Mesaj Gönder
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Adınızı girin"
                        required
                      />
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
                      <Label htmlFor="message">Mesaj *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Mesajınızı buraya yazın..."
                        rows={5}
                        required
                      />
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
                          <Send className="w-4 h-4" />
                          Mesaj Gönder
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom Contact Info */}
      <section className="mt-auto border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center space-y-6">
            {/* Email */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Bize doğrudan e-posta gönderin</p>
              <a
                href="mailto:info@koyuyapayzeka.com"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-lg"
              >
                <Mail className="w-5 h-5" />
                info@koyuyapayzeka.com
              </a>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm text-muted-foreground mb-4">Sosyal medyada bizi takip edin</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-muted-foreground transition-all duration-200 text-sm font-medium ${color}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
