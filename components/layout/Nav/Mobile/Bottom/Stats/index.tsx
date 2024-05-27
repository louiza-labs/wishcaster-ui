"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CastStats from "@/components/cast/stats"
import { Icons } from "@/components/icons"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function MobileStats({
  castWithCategory,
  reactionsObject,
  overallChannelCasts,
}: any) {
  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()

  return (
    <React.Suspense>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Icons.TrendingUp />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] w-full rounded-t-xl">
          <span className="ml-2 text-3xl font-bold"> Stats</span>
          <ScrollArea className="mt-6 h-[calc(100vh-8rem)] w-full pb-0 ">
            <div className="flex flex-col space-y-3">
              <aside className="relative  flex  flex-col gap-y-6 sm:col-span-3 sm:flex">
                <CastStats
                  cast={castWithCategory}
                  reactions={reactionsObject}
                  overallChannelCasts={overallChannelCasts}
                />{" "}
              </aside>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </React.Suspense>
  )
}

export default MobileStats
