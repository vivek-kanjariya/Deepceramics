import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import Navbar from '@/components/Navbar' // Ensure path matches your project structure
import Footer from '@/components/Footer' // Ensure path matches your project structure
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="bg-[#FFFCFA] text-[#171717] antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}