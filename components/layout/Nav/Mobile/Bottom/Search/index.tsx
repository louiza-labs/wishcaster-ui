"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import Search from "@/components/search"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function MobileSearch({}: any) {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const filtersFromParams = useMemo(
    () => searchParams.getAll("search"),
    [searchParams]
  )
  const filterIsSelected = useCallback(
    (categoryName: string) => {
      return filtersFromParams.includes(categoryName)
    },
    [filtersFromParams]
  )

  return (
    <Suspense>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <div className="flex flex-col items-center gap-y-1">
              <Icons.Search />
              <p
                className={
                  filterIsSelected("stats")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              ></p>
            </div>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[70vh] w-full rounded-t-xl pb-10"
        >
          <span className="ml-2 text-3xl font-bold"> Search </span>
          <ScrollArea className="mt-6 h-[calc(100vh-8rem)] w-full overflow-y-auto pb-10 ">
            <div className="flex w-full flex-col space-y-3">
              <aside className="relative flex w-full  flex-col gap-y-6 sm:col-span-3 sm:flex">
                <Search />
              </aside>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </Suspense>
  )
}

export default MobileSearch
