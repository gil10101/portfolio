import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Layout from "@/components/Layout"
import { ProjectsProvider } from "@/components/ProjectsContext"

export const metadata: Metadata = {
  title: "Portfolio - John Doe",
  description: "Professional portfolio of John Doe, Full Stack Developer & Data Analyst",
  icons: {
    icon: "/logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ProjectsProvider>
            <Layout>{children}</Layout>
          </ProjectsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
