import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  addCategoryFieldsToTweets,
  addTaglinesToCasts,
  addUserInfoToTweets,
  categorizeArrayOfCasts,
  extractUserIdsFromTweets,
  generateWhimsicalErrorMessages,
  removeDuplicateTweets,
} from "@/lib/helpers"
import { fetchTaglines } from "@/lib/requests"
import RedirectButton from "@/components/redirect/Button"
import TopReplies from "@/components/replies/TopReplies"
import SaveCast from "@/components/save"
import TweetStats from "@/components/tweet/stats"
import TweetCard from "@/components/tweet/variants/card"
import {
  fetchCastsUntilCovered,
  fetchChannelCasts,
  fetchTweetByIds,
  fetchTweets,
  fetchTwitterUsers,
  getUsersNotionAccessCode,
  searchNotion,
} from "@/app/actions"

interface TweetPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
  params: {
    id: string
  }
}

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function extractTimeFilterParam(params: undefined | string | string[]) {
  if (params) {
    if (params && Array.isArray(params)) {
      return params.find((param: string) => dateOptions.includes(param))
    } else if (params && typeof params === "string") {
      return dateOptions.find((option) => option === params)
    }
  }
}
interface User {
  fid: number
  fname: string
}

const TweetPage: FC<TweetPageProps> = async ({ searchParams, params }) => {
  const tweet = await fetchTweetByIds(params.id)
  const { data: historicalTweets, meta } = await fetchTweets()
  let tweetsWithoutDuplicates = removeDuplicateTweets(historicalTweets)

  const taglineWithHash =
    tweet && tweet.data ? await fetchTaglines([historicalTweets]) : []
  const tweetWithTagline: any =
    tweet && tweet.data
      ? addTaglinesToCasts([historicalTweets], taglineWithHash)
      : tweet
  let enrichedTweet =
    tweet && tweetWithTagline && tweetWithTagline[0]
      ? tweetWithTagline[0]
      : tweetWithTagline
  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results
  const { casts: initialCasts, nextCursor: cursorToUse } = !timeFilterParam
    ? await fetchChannelCasts("someone-build")
    : await fetchCastsUntilCovered(
        "someone-build",
        timeFilterParam as "24-hours" | "7-days" | "30-days" | "ytd"
      )
  // const { reactionsObject } =
  //   enrichedTweet && enrichedTweet.hash
  //     ? await fetchCastsReactionsUntilCovered(
  //         enrichedTweet?.hash,
  //         enrichedTweet?.reactions.likes_count,
  //         enrichedTweet?.reactions.recasts_count
  //       )
  //     : {
  //         reactionsObject: {
  //           likes: [],
  //           recasts: [],
  //         },
  //       }
  let overallChannelCasts = initialCasts
  const categories = categorizeArrayOfCasts([
    ...overallChannelCasts,
    ...tweetsWithoutDuplicates,
    tweet?.data,
  ]) as Category[]

  const users = await fetchTwitterUsers(extractUserIdsFromTweets([tweet?.data]))

  const tweetsWithUsers = addUserInfoToTweets([tweet?.data], users?.data)

  let singleArrayCast = tweetsWithUsers
    ? addCategoryFieldsToCasts(tweetsWithUsers, categories)
    : [enrichedTweet]
  const tweetWithCategory = singleArrayCast[0]

  overallChannelCasts = addCategoryFieldsToCasts(
    overallChannelCasts,
    categories
  ) as Array<CastType>

  let tweetsWithCategories = addCategoryFieldsToTweets(
    tweetsWithoutDuplicates,
    categories
  )

  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)
  const mobileViewParam = parseQueryParam(searchParams.view)

  let filteredPosts = [enrichedTweet]
  const isError = !filteredPosts.length

  return (
    <>
      <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-20">
        <div className="flex flex-row items-start gap-x-4">
          {/* Placeholder for Header if needed */}
        </div>
        <main className="relative grid min-h-screen grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-x-10">
          <article
            className={`${
              mobileViewParam.length && mobileViewParam !== "cast"
                ? "hidden lg:flex"
                : ""
            }  overflow-y-auto lg:col-span-5`}
          >
            {isError ? (
              <ErrorDisplay
                searchTerm={searchTerm}
                filtersParam={filtersParam}
                categoryParam={categoryParam}
              />
            ) : (
              <div className="gap-y-4 overflow-y-auto pb-14 lg:pb-0">
                {tweetWithCategory ? (
                  <>
                    <div className="flex flex-col gap-y-4 bg-background">
                      <h1 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                        Tweet
                      </h1>
                      <div className="hidden xl:block">
                        <TweetCard
                          text={tweetWithCategory.text}
                          likes={tweetWithCategory.public_metrics.like_count}
                          replies={tweetWithCategory.public_metrics.reply_count}
                          retweets={
                            tweetWithCategory.public_metrics.retweet_count
                          }
                          username={tweetWithCategory.username}
                          user={tweetWithCategory.user}
                          category={tweetWithCategory.category}
                          tweet={tweetWithCategory}
                          notionResults={notionResults}
                        />
                      </div>
                      <div className="block xl:hidden">
                        <TweetCard
                          text={tweetWithCategory.text}
                          likes={tweetWithCategory.public_metrics.like_count}
                          replies={tweetWithCategory.public_metrics.reply_count}
                          retweets={
                            tweetWithCategory.public_metrics.retweet_count
                          }
                          username={tweetWithCategory.username}
                          user={tweetWithCategory.user}
                          category={tweetWithCategory.category}
                          tweet={tweetWithCategory}
                          notionResults={notionResults}
                        />
                      </div>
                    </div>

                    <TopReplies
                      castHash={tweetWithCategory.hash ?? ""}
                      notionResults={notionResults}
                    />
                  </>
                ) : null}
              </div>
            )}
          </article>
          <div
            className={`${
              mobileViewParam !== "stats" ? "hidden lg:block" : ""
            } overflow-y-auto sm:col-span-3`}
          >
            <div className="flex flex-col gap-y-10">
              <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                Stats
              </h1>
              <TweetStats
                tweet={tweetWithCategory}
                likes={tweetWithCategory.public_metrics.like_count}
                overallTweets={tweetsWithCategories}
                overallCasts={overallChannelCasts}
              />
            </div>
          </div>
          <div
            className={`${
              mobileViewParam !== "build" ? "hidden lg:block" : ""
            } overflow-y-auto sm:col-span-4`}
          >
            <div className="flex flex-col gap-y-8">
              <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                Let&apos;s build
              </h1>
              {!isError ? (
                <div className="hidden lg:col-span-12 lg:block">
                  <SaveCast
                    isOnTweetsPage={true}
                    notionResults={notionResults}
                    cast={tweetWithCategory}
                  />
                </div>
              ) : null}
              {/* <Build
                cast={tweetWithCategory}
                hash={tweetWithCategory ? tweetWithCategory.hash ?? "" : ""}
                reactions={reactionsObject}
              /> */}
            </div>
          </div>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        {/* <BottomMobileNav
          filteredPosts={[tweetWithCategory]}
          initialCasts={[tweetWithCategory]}
          page="cast"
        /> */}
      </div>
    </>
  )
}

interface HeaderProps {}

interface ErrorDisplayProps {
  searchTerm: string
  filtersParam: string
  categoryParam: string
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({
  searchTerm,
  filtersParam,
  categoryParam,
}) => {
  return (
    <>
      <div className="col-span-12 flex flex-col items-center gap-y-4 px-4">
        <h6 className="mt-20 text-center text-xl font-extrabold leading-tight tracking-tighter sm:text-3xl">
          {generateWhimsicalErrorMessages()}
        </h6>
        <p className="gap-x-2 text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
          This error is showing because no casts are available, try clearing
          some filters
        </p>
        {(searchTerm.length || filtersParam.length || categoryParam.length) && (
          <RedirectButton path={"/"} buttonText="Clear Filters" />
        )}
      </div>
    </>
  )
}

export default TweetPage
