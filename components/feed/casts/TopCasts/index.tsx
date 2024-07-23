"use client"

import { Cast as CastType } from "@/types"
import Autoplay from "embla-carousel-autoplay"

import { sortCastsByProperty } from "@/lib/helpers"
import { useFetchCastsUntilCovered } from "@/hooks/farcaster/casts/useFetchCastsUntilCovered"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import useAddUsersToTweets from "@/hooks/twitter/tweets/useAddUsersToTweets"
import { useFetchTweetsUntilCovered } from "@/hooks/twitter/tweets/useFetchTweetsUntilCovered"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Cast from "@/components/cast/variants/SprintItem"
import { CastSkeleton } from "@/components/loading/cast"
import TweetCard from "@/components/tweet/variants/card"

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
  const { tweetsToShow, fetching: fetchingTweets } =
    useFetchTweetsUntilCovered(casts)
  const { tweetsWithUsers } = useAddUsersToTweets(tweetsToShow)
  let { filteredPosts } = useFilterFeed(
    [...castsWithUserInfo, ...tweetsWithUsers],
    topic
  )
  const sortedPosts = sortCastsByProperty(filteredPosts, "likes_count")

  return (
    <>
      <div className="flex flex-col overflow-y-auto xl:hidden">
        {sortedPosts.slice(0, 10).map((postItem: any, index: number) => (
          <>
            {postItem.reactions ? (
              <div
                key={postItem.hash + postItem.timestamp}
                className="size-full max-h-fit "
              >
                <Cast
                  {...postItem}
                  tagline={postItem.tagline}
                  hideMetrics={false}
                  badgeIsToggled={false}
                  routeToWarpcast={true}
                  cast={postItem}
                  notionResults={notionResults}
                  mentionedProfiles={postItem.mentioned_profiles}
                />
              </div>
            ) : (
              <TweetCard
                text={postItem.text}
                likes={postItem.public_metrics.like_count}
                replies={postItem.public_metrics.reply_count}
                retweets={postItem.public_metrics.retweet_count}
                username={postItem.username}
                user={postItem.user}
                category={postItem.category}
                tweet={postItem}
                notionResults={notionResults}
              />
            )}
          </>
        ))}
      </div>
      <div className="hidden size-fit xl:block ">
        {sortedPosts &&
        sortedPosts.length &&
        !(fetchingCasts || fetchingTweets) ? (
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
                      {postItem.reactions ? (
                        <Cast
                          {...postItem}
                          hideMetrics={false}
                          tagline={postItem.tagline}
                          badgeIsToggled={false}
                          routeToWarpcast={true}
                          notionResults={notionResults}
                          cast={postItem}
                          mentionedProfiles={postItem.mentioned_profiles}
                        />
                      ) : (
                        <TweetCard
                          text={postItem.text}
                          likes={postItem.public_metrics.like_count}
                          replies={postItem.public_metrics.reply_count}
                          retweets={postItem.public_metrics.retweet_count}
                          username={postItem.username}
                          user={postItem.user}
                          category={postItem.category}
                          tweet={postItem}
                          notionResults={notionResults}
                        />
                      )}
                    </>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : fetchingCasts || fetchingTweets ? (
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
