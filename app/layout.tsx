import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-nunito'
})

export const metadata: Metadata = {
  title: 'KOU AI - Yapay Zeka Kulubu',
  description: 'Yapay zeka tutkunlarinin bulusma noktasi. Etkinlikler, projeler ve egitimlerle gelecegi birlikte sekillendiriyoruz.',
  keywords: ['yapay zeka', 'AI', 'makine ogrenimi', 'deep learning', 'kulup'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${nunito.variable} ${nunito.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
