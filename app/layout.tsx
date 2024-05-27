import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import InitialLoading from "@/components/loading/initial"
import DynamicProvider from "@/components/providers/dynamic"
import NeynarProvider from "@/components/providers/neynar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import "@/styles/globals.css"
import { Suspense } from "react/"
import { Metadata, type Viewport } from "next"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },

  description: siteConfig.description,

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,

    images: [
      "https://res.cloudinary.com/dermgckap/image/upload/v1716361984/twitterCard-Wishcaster_qygqg5.svg",
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WishCaster",
    description: "Find what to build next",
    creator: "@joesephAtToledano",
    images: [
      "https://res.cloudinary.com/dermgckap/image/upload/v1716361984/twitterCard-Wishcaster_qygqg5.svg",
    ], // Must be an absolute URL
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  maximumScale: 1,
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <DynamicProvider>
          <NeynarProvider>
            <body
              className={cn(
                "bg-background min-h-screen font-sans antialiased",
                fontSans.variable
              )}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <Suspense fallback={<InitialLoading />}>
                  <div className="relative flex min-h-screen flex-col">
                    <SiteHeader />
                    <div className="flex-1">{children}</div>
                    <SiteFooter />
                  </div>
                  <TailwindIndicator />
                </Suspense>
              </ThemeProvider>
            </body>
          </NeynarProvider>
        </DynamicProvider>
      </html>
    </>
  )
}
