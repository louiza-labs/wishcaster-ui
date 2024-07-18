"use client"

import { Cast as CastType } from "@/types"
import Autoplay from "embla-carousel-autoplay"

import { sortCastsByProperty } from "@/lib/helpers"
import { useFetchCastsUntilCovered } from "@/hooks/farcaster/casts/useFetchCastsUntilCovered"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Cast from "@/components/cast/variants/SprintItem"
import { CastSkeleton } from "@/components/loading/cast"

interface TopCastsProps {
  casts: CastType[]
  cursor: string
  sortParam: string
  topic: string
  notionResults: any
}

const TopCasts = ({
  casts,
  cursor,
  topic,
  sortParam,
  notionResults,
}: TopCastsProps) => {
  const { castsToShow: castsWithUserInfo, fetchingCasts } =
    useFetchCastsUntilCovered(casts)
  let { filteredCasts } = useFilterFeed(castsWithUserInfo, topic)
  const sortedCasts = sortCastsByProperty(filteredCasts, "liked_count")

  return (
    <>
      <div className="flex flex-col overflow-y-auto xl:hidden">
        {sortedCasts.slice(0, 10).map((castItem: CastType, index: number) => (
          <div
            key={castItem.hash + castItem.timestamp}
            className="size-full max-h-fit "
          >
            <Cast
              {...castItem}
              tagline={castItem.tagline}
              hideMetrics={false}
              badgeIsToggled={false}
              routeToWarpcast={true}
              cast={castItem}
              notionResults={notionResults}
              mentionedProfiles={castItem.mentioned_profiles}
            />
          </div>
        ))}
      </div>
      <div className="hidden size-fit xl:block ">
        {sortedCasts && sortedCasts.length && !fetchingCasts ? (
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
                  className=" basis:1 w-fit pl-1  md:basis-1/2"
                  key={castItem.hash}
                >
                  <div className="grid size-fit max-w-[90vw] grid-cols-1 md:basis-1/2 lg:max-h-screen lg:overflow-y-scroll xl:h-[70vh]">
                    <Cast
                      {...castItem}
                      hideMetrics={false}
                      tagline={castItem.tagline}
                      badgeIsToggled={false}
                      routeToWarpcast={true}
                      notionResults={notionResults}
                      cast={castItem}
                      mentionedProfiles={castItem.mentioned_profiles}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : fetchingCasts ? (
          <div className="mt-4 flex size-full flex-row items-center justify-between gap-x-6">
            <CastSkeleton size={"large"} />
            <CastSkeleton size={"large"} />

            <CastSkeleton size={"large"} />
          </div>
        ) : (
          <div>
            <p className="text-xl font-light">No casts found</p>
          </div>
        )}
      </div>
    </>
  )
}

export default TopCasts
