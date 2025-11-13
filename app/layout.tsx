import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ToastProvider } from './components/Toast'

export const metadata = {
  title: 'vorteX Health',
  description: 'Healthcare-grade burnout intelligence with orchestration and ledger auditability',
}

const fontSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`page-shell ${fontSans.variable} font-sans`}>
        <ToastProvider>
          <Navbar />
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
            <main className="relative container mx-auto px-6 md:px-10 py-10">
              {children}
            </main>
          </div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
