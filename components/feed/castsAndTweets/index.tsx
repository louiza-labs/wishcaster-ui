"use client"

import { Fragment, Suspense, useCallback, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Cast as CastType } from "@/types"

import { useLoadMoreCasts } from "@/hooks/farcaster/casts/useLoadMoreCasts"
import useFilterFeed from "@/hooks/feed/useFilterFeed"
import SpringItemCast from "@/components/cast/variants/SprintItem"
import CastAsTableRow from "@/components/cast/variants/TableRow"
import CastFeedSkeleton from "@/components/loading/feed/casts"
import TweetAsCard from "@/components/tweet/variants/card"
import TweetAsRow from "@/components/tweet/variants/row"

interface CastFeedProps {
  casts: CastType[]
  nextCursor: string
  timeFilterParam: any
  columns?: number
  notionResults?: any[]
  topic?: string
  tweets: any
}

const CastAndTweetsFeed = ({
  casts,
  nextCursor,
  timeFilterParam,
  columns,
  notionResults,
  topic,
  tweets,
}: CastFeedProps) => {
  const searchParams = useSearchParams()
  const { castsToShow, ref, fetchingCasts } = useLoadMoreCasts(
    [...tweets, ...casts],
    nextCursor,
    timeFilterParam
  )
  const [castCardStyleToShow, setCastCardStyleToShow] = useState("product")
  const { filteredPosts } = useFilterFeed(castsToShow, topic)

  const router = useRouter()
  const categoriesFromParams = searchParams.getAll("topics").join(",")
  const cardLayoutFromParams = searchParams.getAll("card-layout").join(",")

  const createQueryString = useCallback(
    (name: string, value: string, addValue: boolean) => {
      const params = new URLSearchParams(searchParams.toString())

      // Get existing category values
      const existingCategories = params.getAll(name)

      if (addValue) {
        // Add the new value if it's not already present
        if (!existingCategories.includes(value)) {
          params.append(name, value)
        }
      } else {
        // Remove the value if it exists
        const updatedCategories = existingCategories.filter(
          (category) => category !== value
        )

        // Update the parameter with the filtered categories
        params.delete(name)
        updatedCategories.forEach((category) => {
          params.append(name, category)
        })
      }

      return params.toString()
    },
    [searchParams]
  )

  const badgeIsToggled = (categoryName: string) => {
    return (
      categoryName &&
      categoriesFromParams &&
      categoriesFromParams.includes(categoryName)
    )
  }

  const handleToggleCategoryClick = (categoryName: string) => {
    if (categoriesFromParams && categoriesFromParams.length > 0) {
      // Check if the category is already toggled
      const isToggled = categoriesFromParams.includes(categoryName)

      // Toggle the category based on its current state
      const newSearchParams = createQueryString(
        "topics",
        categoryName,
        !isToggled
      )

      router.push("?" + newSearchParams)
    } else {
      // If no categories are selected, simply toggle the clicked category
      router.push("?" + createQueryString("topics", categoryName, true))
    }
  }

  const EmptyStateFallBack = () => (
    <div className="flex flex-col items-center justify-center py-2">
      <p className="text-center text-2xl font-light">
        No casts found, try adjusting the search terms or filters
      </p>
    </div>
  )

  const layoutValueIsSelected = useCallback(
    (categoryName: string) => {
      return cardLayoutFromParams.includes(categoryName)
    },
    [cardLayoutFromParams]
  )

  const CastCardToUse = useMemo(() => {
    return !layoutValueIsSelected("compact") ? SpringItemCast : CastAsTableRow
  }, [layoutValueIsSelected])

  const TweetCardToUse = useMemo(() => {
    return !layoutValueIsSelected("compact") ? TweetAsCard : TweetAsRow
  }, [layoutValueIsSelected])

  const tweetsAndCasts = useMemo(() => {
    return [...filteredPosts]
  }, [filteredPosts])

  return (
    <Suspense fallback={<CastFeedSkeleton count={5} />}>
      <div
        className={`mt-8 grid grid-cols-1  overflow-x-hidden px-2 md:px-4 lg:col-span-6 lg:col-start-4 lg:mt-0 ${
          layoutValueIsSelected("compact")
            ? "gap-y-1 lg:grid-cols-1"
            : columns
            ? `gap-4 lg:grid-cols-2`
            : "gap-4 lg:grid-cols-2"
        } lg:px-10`}
      >
        {fetchingCasts && !(filteredPosts && filteredPosts.length) ? (
          <div
            className={
              columns
                ? "col-span-2 mt-10 flex w-full gap-x-10  lg:flex-row lg:justify-center"
                : "flex flex-col "
            }
          >
            {columns ? (
              <div className="hidden lg:block">
                {" "}
                <CastFeedSkeleton count={4} />{" "}
              </div>
            ) : null}
            <CastFeedSkeleton count={4} />
          </div>
        ) : tweetsAndCasts && tweetsAndCasts.length ? (
          tweetsAndCasts.map((tweetOrCast: any, index) => (
            <Fragment key={tweetOrCast.hash || tweetOrCast.id || index}>
              {tweetOrCast.type === "tweet" ? (
                <TweetCardToUse
                  text={tweetOrCast.text}
                  likes={tweetOrCast.public_metrics.like_count}
                  replies={tweetOrCast.public_metrics.reply_count}
                  retweets={tweetOrCast.public_metrics.retweet_count}
                  username={tweetOrCast.username}
                  user={tweetOrCast.user}
                  category={tweetOrCast.category}
                  tweet={tweetOrCast}
                  notionResults={notionResults}
                />
              ) : (
                <CastCardToUse
                  key={tweetOrCast.hash}
                  text={tweetOrCast.text}
                  cast={tweetOrCast}
                  timestamp={tweetOrCast.timestamp}
                  parent_url={tweetOrCast.parent_url}
                  reactions={tweetOrCast.reactions}
                  replies={tweetOrCast.replies}
                  embeds={tweetOrCast.embeds}
                  tagline={tweetOrCast.tagline}
                  author={tweetOrCast.author}
                  hash={tweetOrCast.hash}
                  thread_hash={tweetOrCast.thread_hash}
                  mentionedProfiles={tweetOrCast.mentioned_profiles}
                  parent_hash={tweetOrCast.parent_hash}
                  parent_author={tweetOrCast.parent_author}
                  root_parent_url={tweetOrCast.root_parent_url}
                  category={tweetOrCast.category}
                  notionResults={notionResults}
                  handleToggleCategoryClick={() =>
                    handleToggleCategoryClick(tweetOrCast.category?.id || "")
                  }
                  badgeIsToggled={badgeIsToggled(
                    tweetOrCast.category?.id || ""
                  )}
                />
              )}
            </Fragment>
          ))
        ) : (
          <EmptyStateFallBack />
        )}
        <div ref={ref}></div>
      </div>
    </Suspense>
  )
}

export default CastAndTweetsFeed
