"use client"

import Autoplay from "embla-carousel-autoplay"

import { sortPostsByProperty } from "@/lib/helpers"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import PostCard from "@/components/post"

interface TopCastsProps {
  posts: any[]
  cursor: string
  sortParam: string
  topic: string
  notionResults: any
}

const TopCasts = ({
  posts,
  cursor,
  topic,
  sortParam,
  notionResults,
}: TopCastsProps) => {
  let { filteredPosts } = useFilterFeed(posts, topic)
  const sortedPosts = sortPostsByProperty(filteredPosts, "likesCount")

  return (
    <>
      <div className="flex flex-col gap-y-2 overflow-y-auto xl:hidden">
        {sortedPosts.slice(0, 10).map((postItem: any, index: number) => (
          <>
            <PostCard
              renderEmbeds={true}
              post={postItem}
              notionResults={notionResults}
            />
          </>
        ))}
      </div>
      <div className="hidden size-fit xl:block ">
        {sortedPosts && sortedPosts.length ? (
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
              {sortedPosts.map((postItem: any) => (
                <CarouselItem
                  className=" basis:1 w-full pl-1  md:basis-1/2"
                  key={postItem.hash}
                >
                  <div className="grid size-fit max-w-[90vw] grid-cols-1 py-2 md:basis-1/2 lg:max-h-screen lg:overflow-y-scroll">
                    <>
                      <PostCard
                        renderEmbeds={true}
                        post={postItem}
                        notionResults={notionResults}
                      />
                    </>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : null}
      </div>
    </>
  )
}

export default TopCasts
