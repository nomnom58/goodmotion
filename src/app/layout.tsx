import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Instrument_Serif, JetBrains_Mono, Inter } from 'next/font/google'
import { PostHogProvider } from '@/providers/PostHogProvider'
import { BYPASS_AUTH } from '@/lib/auth-config'
import { Header } from '@/components/layout/Header'
import { ToastProvider } from '@/components/ui/Toast'
import './globals.css'


const instrumentSerif = Instrument_Serif({
  weight: '400',
  variable: '--font-instrument-serif',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'GOOD MOTION',
  description: 'A growing collection of high-end components, for Framer/Web',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <html
          lang="en"
          className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col bg-background text-primary-text font-sans selection:bg-brand/10 selection:text-brand">
            <ToastProvider>
              <Header />

              <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 pb-5 pt-4">
                {children}
              </main>

              <footer className="max-w-[1440px] mx-auto w-full p-4 pt-10 border-t border-border-color mt-auto">
                <div className="flex flex-col items-start gap-4">
                  <Image 
                    src="/logo.png" 
                    alt="GOOD MOTION" 
                    width={120} 
                    height={32} 
                    className="h-6 w-auto object-contain"
                  />
                  <div className="text-[14px] text-secondary-text">© 2026 GOOD MOTION</div>
                </div>
              </footer>
            </ToastProvider>
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  )
}
