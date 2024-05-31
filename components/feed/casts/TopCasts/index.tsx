"use client"

import { Cast as CastType } from "@/types"

import { sortCastsByProperty } from "@/lib/helpers"
import { useLoadMoreCasts } from "@/hooks/farcaster/useLoadMoreCasts"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Cast from "@/components/cast"

interface TopCastsProps {
  casts: CastType[]
  cursor: string
  topic: string
}

const TopCasts = ({ casts, cursor, topic }: TopCastsProps) => {
  const { castsToShow: castsWithUserInfo } = useLoadMoreCasts(casts, cursor)
  let { filteredCasts } = useFilterFeed(castsWithUserInfo, topic)
  const sortedCasts = sortCastsByProperty(filteredCasts, "liked_count")

  return (
    <div className="size-fit   overflow-auto overflow-y-scroll ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          slidesToScroll: 2,
        }}
        className="col-span-4 size-fit"
      >
        <CarouselContent className="-ml-1 size-fit">
          {sortedCasts.map((castItem: CastType) => (
            <CarouselItem
              className=" w-fit basis-1/2  pl-1"
              key={castItem.hash}
            >
              <div className="grid w-fit basis-1/2 grid-cols-1">
                <Cast
                  {...castItem}
                  hideMetrics={false}
                  badgeIsToggled={false}
                  routeToWarpcast={true}
                  mentionedProfiles={castItem.mentioned_profiles}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-10" />
        <CarouselNext className="" />
      </Carousel>
    </div>
  )
}

export default TopCasts
