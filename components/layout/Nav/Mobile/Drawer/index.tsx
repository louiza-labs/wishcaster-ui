"use client"

import * as React from "react"
import { useMemo } from "react"
import Link, { LinkProps } from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()
  const categoriesFromParams = useMemo(
    () => parseQueryParam(searchParams.getAll("categories")),
    [searchParams]
  )
  const sortParams = useMemo(
    () => parseQueryParam(searchParams.getAll("sort")),
    [searchParams]
  )

  return (
    <React.Suspense>
      <div className="flex   md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Icons.hamburger />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={setOpen}
            >
              <Icons.logo className="mr-2 size-4" />
              <span className="ml-2 font-bold">{siteConfig.name}</span>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6"></ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </React.Suspense>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}

export default MobileNav
