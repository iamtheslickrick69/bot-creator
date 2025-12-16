import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Bot Creator - AI Chatbot Builder",
  description: "Create and deploy AI-powered chatbots for your website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] antialiased">
        {children}
      </body>
    </html>
  )
}
