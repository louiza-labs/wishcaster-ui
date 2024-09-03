"use client"

import { buildRankings } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface MobileRankingProps {
  casts?: any
  castsAndOrTweets: any
}
function MobileRankings({ casts, castsAndOrTweets }: MobileRankingProps) {
  const { filteredPosts } = useFilterFeed(castsAndOrTweets)

  const rankedTopicsByLikes = buildRankings(
    filteredPosts,
    "category",
    "likesCount",
    10
  )

  const RankedCard = ({ value, index }: any) => {
    return (
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border dark:border-gray-200 dark:bg-transparent dark:text-gray-50 dark:hover:bg-gray-700">
        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="">{value.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value.value}
          </span>
        </div>
      </div>
    )
  }

  return (
    <Carousel className=" w-full  ">
      <CarouselContent className="-ml-1">
        {rankedTopicsByLikes.map((value, index) => (
          <CarouselItem key={index} className=" basis-1/2 pl-1">
            <div className="p-1">
              <RankedCard value={value} index={index + 1} key={index} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  )
}

export default MobileRankings
