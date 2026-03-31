'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SiteLogo } from '@/components/site-logo'
import { Lock, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Gecersiz kullanici adi veya sifre')
      }
    } catch {
      setError('Giris yapilamadi. Lutfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <SiteLogo className="h-16 w-16 mx-auto mb-4 rounded-2xl" priority />
          <CardTitle className="text-2xl">Admin Paneli</CardTitle>
          <CardDescription>
            Yonetim paneline erisim icin giris yapin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanici Adi</Label>
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pl-10"
                  required
                />
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Sifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}
            
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? 'Giris Yapiliyor...' : (
                <>
                  <LogIn className="w-4 h-4" />
                  Giris Yap
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo Bilgileri:</strong><br />
              Kullanici: admin | Sifre: kouai2026
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
