"use client"

import { useFooterVisibilityStore } from "@/store"
import { Cast as CastType } from "@/types"

import { cn } from "@/lib/utils"
import CastPageNavItem from "@/components/layout/Nav/Mobile/Bottom/CastPage"
import MobileRankings from "@/components/layout/Nav/Mobile/Bottom/Rankings"
import TopicPageNavItem from "@/components/layout/Nav/Mobile/Bottom/Topic/TopicPage"
import TopicsNavButton from "@/components/layout/Nav/Mobile/Bottom/Topics"
import TopicsPageNavItem from "@/components/layout/Nav/Mobile/Bottom/Topics/TopicsPage"

// Adjust the path as necessary

interface BottomMobileNavProps {
  initialCasts?: CastType[] | any
  castWithCategory?: any
  reactionsObject?: any
  overallChannelCast?: any
  filteredCasts: CastType[] | any
  page?: "cast" | "home" | "topics" | "topic"
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
        "bg-background fixed bottom-0 z-40  h-20 w-full flex-row items-center justify-around gap-x-4 overflow-hidden border-t  px-2"
      )}
    >
      {page === "cast" ? (
        <>
          <CastPageNavItem section="stats" />
          <CastPageNavItem section="cast" />

          <CastPageNavItem section="build" />
        </>
      ) : page === "topics" ? (
        <>
          <TopicsPageNavItem section="popular" />

          <TopicsPageNavItem section="table" />
          {/* <MobileFiltering initialCasts={initialCasts} /> */}
        </>
      ) : page === "topic" ? (
        <>
          <TopicPageNavItem section="popular" />
          {/* <TopicPageNavItem section="feed" /> */}

          <TopicPageNavItem section="build" />
        </>
      ) : (
        <>
          {/* <MobileFiltering initialCasts={filteredCasts} /> */}

          <TopicsNavButton />

          <MobileRankings initialCasts={initialCasts} />
          {/* <MobileSorting /> */}
        </>
      )}
    </div>
  )
}

export default BottomMobileNav
