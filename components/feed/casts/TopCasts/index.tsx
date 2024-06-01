"use client"

import { Cast as CastType } from "@/types"
import Autoplay from "embla-carousel-autoplay"

import { sortCastsByProperty } from "@/lib/helpers"
import { useFetchCastsUntilCovered } from "@/hooks/farcaster/useFetchCastsUntilCovered"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Cast from "@/components/cast"

interface TopCastsProps {
  casts: CastType[]
  cursor: string
  topic: string
}

const TopCasts = ({ casts, cursor, topic }: TopCastsProps) => {
  const { castsToShow: castsWithUserInfo } = useFetchCastsUntilCovered(casts)
  let { filteredCasts } = useFilterFeed(castsWithUserInfo, topic)
  const sortedCasts = sortCastsByProperty(filteredCasts, "liked_count")

  return (
    <div className="size-fit   ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          slidesToScroll: 2,
        }}
        plugins={[
          Autoplay({
            delay: 10000,
          }),
        ]}
        className="col-span-4 size-fit"
      >
        <CarouselContent className="-ml-1 size-fit">
          {sortedCasts.map((castItem: CastType) => (
            <CarouselItem
              className=" w-fit pl-1  md:basis-1/2"
              key={castItem.hash}
            >
              <div className="grid max-h-screen w-fit grid-cols-1 overflow-y-scroll md:basis-1/2 xl:h-[70vh]">
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
      </Carousel>
    </div>
  )
}

export default TopCasts
