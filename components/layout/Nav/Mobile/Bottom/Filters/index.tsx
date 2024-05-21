"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Filters from "@/components/filters"
import { Icons } from "@/components/icons"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function MobileFiltering({ initialCasts }: any) {
  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()

  return (
    <React.Suspense>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Icons.Filter />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl">
          <span className="ml-2 text-3xl font-bold"> Filter </span>
          <ScrollArea className="mt-6 h-[calc(100vh-8rem)] w-full ">
            <div className="flex w-full flex-col items-center space-y-3">
              <aside className="relative flex w-full flex-col items-center  gap-y-6 pb-2 sm:col-span-3 sm:flex">
                <Filters initialCasts={initialCasts} />
              </aside>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </React.Suspense>
  )
}

export default MobileFiltering
