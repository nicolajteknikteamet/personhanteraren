import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Personhanteraren',
  description: 'Person management system for Soundforce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
