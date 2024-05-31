"use client"

import { Cast as CastType } from "@/types"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Cast from "@/components/cast"

interface TopCastsProps {
  sortedCasts: CastType[]
}

const TopCasts = ({ sortedCasts }: TopCastsProps) => {
  console.log("the sortedCasts", sortedCasts)
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
