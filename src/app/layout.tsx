import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { PostHogProvider } from '@/providers/PostHogProvider'
import { BYPASS_AUTH } from '@/lib/auth-config'
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
          className={`${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col bg-background text-primary-text font-mono selection:bg-brand/10 selection:text-brand">
            <ToastProvider>
              <header className="sticky top-0 z-50 pt-5 pb-0 bg-background/80 backdrop-blur-md">
                <div className="max-w-[1920px] mx-auto flex justify-between items-center h-10 px-5">
                  <Link href="/" className="h-full flex items-center">
                    <Image 
                      src="/logo.png" 
                      alt="GOOD MOTION" 
                      width={150} 
                      height={40} 
                      className="h-8 w-auto object-contain"
                      priority
                    />
                  </Link>
                  <div className="flex items-center gap-4">
                    {!BYPASS_AUTH && (
                      <>
                        <Show when="signed-out">
                          <div className="flex items-center gap-2 text-[14px] font-medium text-primary-text">
                            <SignInButton mode="modal">
                              <button className="hover:opacity-70 transition-opacity cursor-pointer border-none bg-transparent p-0 m-0">
                                Log In
                              </button>
                            </SignInButton>
                            <span className="opacity-50">.</span>
                            <SignUpButton mode="modal">
                              <button className="hover:opacity-70 transition-opacity cursor-pointer border-none bg-transparent p-0 m-0">
                                Sign Up
                              </button>
                            </SignUpButton>
                          </div>
                        </Show>

                        <Show when="signed-in">
                          <UserButton 
                            appearance={{
                              elements: {
                                userButtonAvatarBox: 'w-8 h-8',
                              }
                            }}
                          />
                        </Show>
                      </>
                    )}
                  </div>
                </div>
              </header>

              <main className="flex-1 max-w-[1920px] mx-auto w-full px-5 pb-5 pt-4">
                {children}
              </main>

              <footer className="max-w-[1920px] mx-auto w-full p-5 pt-10 border-t border-border-color mt-auto">
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
