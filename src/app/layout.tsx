import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Instrument_Serif, JetBrains_Mono, Inter } from 'next/font/google'
import { PostHogProvider } from '@/providers/PostHogProvider'
import { BYPASS_AUTH } from '@/lib/auth-config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { CustomCursor } from '@/components/ui/CustomCursor'
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
          <body className="min-h-full flex flex-col bg-[#F2F2F2] text-primary-text font-sans selection:bg-brand/10 selection:text-brand">
            <ToastProvider>
              <CustomCursor />
              <div className="max-w-[1440px] mx-auto w-full min-h-screen flex flex-col bg-white border-x-0 md:border-x border-[#000000]/10">
                <Header />

                <main className="flex-1 w-full px-4 pb-5 pt-4">
                  {children}
                </main>

                <Footer />
              </div>
            </ToastProvider>
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  )
}
