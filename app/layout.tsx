import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { PurchaseProvider } from "@/components/purchase-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "KHIP - Korean Corporate Intelligence Platform",
  description: "AI-powered Korean corporate intelligence platform providing instant insights on Korean companies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <PurchaseProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </PurchaseProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
