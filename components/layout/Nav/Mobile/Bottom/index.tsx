"use client"

import { useFooterVisibilityStore } from "@/store"
import { Cast as CastType } from "@/types"

import { cn } from "@/lib/utils"
import CastPageNavItem from "@/components/layout/Nav/Mobile/Bottom/CastPage"
import MobileFiltering from "@/components/layout/Nav/Mobile/Bottom/Filters"
import MobileRankings from "@/components/layout/Nav/Mobile/Bottom/Rankings"
import MobileSearch from "@/components/layout/Nav/Mobile/Bottom/Search"
import MobileSorting from "@/components/layout/Nav/Mobile/Bottom/Sort"

// Adjust the path as necessary

interface BottomMobileNavProps {
  initialCasts?: CastType[] | any
  castWithCategory?: any
  reactionsObject?: any
  overallChannelCast?: any
  filteredCasts: CastType[] | any
  page?: "cast" | "home"
}
const BottomMobileNav = ({
  initialCasts,
  filteredCasts,
  castWithCategory,
  reactionsObject,
  overallChannelCast,
  page,
}: BottomMobileNavProps) => {
  const isFooterVisible = useFooterVisibilityStore(
    (state) => state.isFooterVisible
  )

  return (
    <div
      className={cn(
        isFooterVisible ? "hidden" : "flex",
        "bg-background fixed bottom-0 z-40  h-20 w-full flex-row items-center justify-around gap-x-10 overflow-hidden border-t px-0"
      )}
    >
      {page === "cast" ? (
        <>
          <CastPageNavItem section="stats" />
          <CastPageNavItem section="cast" />

          <CastPageNavItem section="build" />
        </>
      ) : (
        <>
          <MobileSearch />
          <MobileFiltering
            initialCasts={initialCasts}
            filteredCasts={filteredCasts}
          />
          <MobileRankings initialCasts={initialCasts} />
          <MobileSorting />
        </>
      )}
    </div>
  )
}

export default BottomMobileNav
