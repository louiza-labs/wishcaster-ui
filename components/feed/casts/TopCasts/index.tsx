"use client"

import Autoplay from "embla-carousel-autoplay"

import { sortCastsByProperty } from "@/lib/helpers"
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
  const sortedPosts = sortCastsByProperty(filteredPosts, "likes_count")

  return (
    <>
      <div className="flex flex-col overflow-y-auto xl:hidden">
        {sortedPosts.slice(0, 10).map((postItem: any, index: number) => (
          <>
            <PostCard
              source={postItem.object === "cast" ? "farcaster" : "twitter"}
              text={postItem.text}
              user={
                postItem.object === "cast" ? postItem.author : postItem.user
              }
              category={postItem.category}
              tagline={postItem.tagline}
              embeds={postItem.embeds ?? []}
              media={postItem.media ?? []}
              postId={postItem.hash}
              referencedPost={postItem.referenced_tweet}
              mentionedProfiles={postItem.mentioned_profiles ?? []}
              renderEmbeds={true}
              post={postItem}
              timestamp={
                postItem.object === "cast"
                  ? postItem.timestamp
                  : postItem.created_at
              }
              likes={
                postItem.public_metrics
                  ? postItem.public_metrics.like_count
                  : undefined
              }
              retweets={
                postItem.public_metrics
                  ? postItem.public_metrics.retweet_count
                  : undefined
              }
              impressions={
                postItem.public_metrics
                  ? postItem.public_metrics.impression_count
                  : undefined
              }
              replies={
                postItem.public_metrics
                  ? postItem.public_metrics.reply_count
                  : undefined
              }
              reactions={postItem.reactions}
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
                  className=" basis:1 w-fit pl-1  md:basis-1/2"
                  key={postItem.hash}
                >
                  <div className="grid size-fit max-w-[90vw] grid-cols-1 md:basis-1/2 lg:max-h-screen lg:overflow-y-scroll xl:h-[70vh]">
                    <>
                      <PostCard
                        source={
                          postItem.object === "cast" ? "farcaster" : "twitter"
                        }
                        text={postItem.text}
                        user={
                          postItem.object === "cast"
                            ? postItem.author
                            : postItem.user
                        }
                        category={postItem.category}
                        tagline={postItem.tagline}
                        embeds={postItem.embeds ?? []}
                        media={postItem.media ?? []}
                        postId={postItem.hash}
                        referencedPost={postItem.referenced_tweet}
                        mentionedProfiles={postItem.mentioned_profiles ?? []}
                        renderEmbeds={true}
                        timestamp={
                          postItem.object === "cast"
                            ? postItem.timestamp
                            : postItem.created_at
                        }
                        post={postItem}
                        likes={
                          postItem.public_metrics
                            ? postItem.public_metrics.like_count
                            : undefined
                        }
                        retweets={
                          postItem.public_metrics
                            ? postItem.public_metrics.retweet_count
                            : undefined
                        }
                        impressions={
                          postItem.public_metrics
                            ? postItem.public_metrics.impression_count
                            : undefined
                        }
                        replies={
                          postItem.public_metrics
                            ? postItem.public_metrics.reply_count
                            : undefined
                        }
                        reactions={postItem.reactions}
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
