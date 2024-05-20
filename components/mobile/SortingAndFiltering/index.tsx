"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Filters from "@/components/filters"
import { Icons } from "@/components/icons"
import SortCasts from "@/components/sort/SortCasts"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function MobileSortingAndFiltering({ initialCasts, filteredCasts }: any) {
  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()

  return (
    <React.Suspense>
      <div className="flex   md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Icons.Filter size={"sm"} />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="">
            <span className="ml-2 text-3xl font-bold">Sort and Filter </span>
            <ScrollArea className="mt-6  h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <aside className="relative  flex  flex-col gap-y-6 sm:col-span-3 sm:flex">
                  <SortCasts />
                  <Filters initialCasts={initialCasts} />
                </aside>
              </div>
            </ScrollArea>
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

export default MobileSortingAndFiltering
