import { FC } from "react"
import { Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  categorizeArrayOfPosts,
  generateWhimsicalErrorMessages,
} from "@/lib/helpers"
import Build from "@/components/buildComponent"
import CastStats from "@/components/cast/stats"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import PostCard from "@/components/post"
import RedirectButton from "@/components/redirect/Button"
import TopReplies from "@/components/replies/TopReplies"
import SaveCast from "@/components/save"
import TweetStats from "@/components/tweet/stats"
import {
  fetchCastsReactionsUntilCovered,
  fetchNormalizedCast,
  fetchNormalizedTweet,
  fetchPosts,
  getUsersNotionAccessCode,
  searchNotion,
} from "@/app/actions"

interface PostPageProps {
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

const PostPage: FC<PostPageProps> = async ({ searchParams, params }) => {
  const source = parseQueryParam(searchParams.source)
  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined
  let { data: post } =
    source === "farcaster"
      ? await fetchNormalizedCast(params.id)
      : await fetchNormalizedTweet(params.id)
  const overallPosts = await fetchPosts({
    timePeriod: timeFilterParam ?? "30-days",
    channelId: "someone-build",
  })

  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results
  const { reactionsObject } =
    source === "farcaster" && post && post.id
      ? await fetchCastsReactionsUntilCovered(
          post?.id,
          post?.likesCount,
          post?.sharesCount
        )
      : {
          reactionsObject: {
            likes: [],
            recasts: [],
          },
        }
  const categories = categorizeArrayOfPosts(overallPosts) as Category[]

  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)
  const mobileViewParam = parseQueryParam(searchParams.view)

  let filteredPosts = [post]

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
                {post ? (
                  <>
                    <div className="flex flex-col gap-y-4 bg-background">
                      <h1 className="hidden text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:block md:text-left md:text-4xl">
                        {source === "farcaster" ? "Cast" : "Tweet"}
                      </h1>

                      <PostCard
                        renderEmbeds={true}
                        post={post}
                        notionResults={notionResults}
                      />
                    </div>

                    <TopReplies
                      castHash={post.id ?? ""}
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
              {source === "farcaster" ? (
                <CastStats
                  cast={post}
                  reactions={reactionsObject}
                  overallChannelCasts={overallPosts}
                />
              ) : (
                <TweetStats
                  tweet={post}
                  likes={post.likesCount}
                  overallTweets={overallPosts}
                  overallCasts={overallPosts}
                />
              )}
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
              <div className="hidden lg:col-span-12 lg:block">
                <SaveCast notionResults={notionResults} cast={post} />
              </div>
              {source === "farcaster" ? (
                <Build
                  cast={post}
                  hash={post ? post.id ?? "" : ""}
                  reactions={reactionsObject}
                />
              ) : null}
            </div>
          </div>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        <BottomMobileNav
          filteredPosts={[post]}
          initialCasts={[post]}
          page="cast"
        />
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

export default PostPage
