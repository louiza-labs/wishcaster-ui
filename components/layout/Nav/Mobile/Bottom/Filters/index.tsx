"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Filters from "@/components/filters/new"
import { Icons } from "@/components/icons"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

interface MobileFilteringProps {
  initialCasts: CastType[]
}

function MobileFiltering({ initialCasts }: MobileFilteringProps) {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const filtersFromParams = useMemo(
    () => searchParams.getAll("filter"),
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
              <Icons.Filter />
              <p
                className={
                  filterIsSelected("rankings")
                    ? "text-xs font-bold"
                    : "text-xs font-medium"
                }
              >
                Filters
              </p>
            </div>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[80vh] overflow-y-scroll  rounded-t-xl"
        >
          <span className="ml-2 text-3xl font-bold"> Filter </span>
          <ScrollArea className="mt-6 h-[120%] w-full sm:h-full ">
            <div className="flex w-full flex-col items-center space-y-3">
              <aside className="relative flex w-full flex-col items-center  gap-y-6 pb-2 sm:col-span-3 sm:flex">
                <Filters posts={initialCasts} />
              </aside>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </Suspense>
  )
}

export default MobileFiltering
