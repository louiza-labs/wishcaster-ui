import { FC } from "react"
import { Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  categorizeArrayOfPosts,
  generateWhimsicalErrorMessages,
} from "@/lib/helpers"
import Banner from "@/components/banner"
import PostPageElement from "@/components/postPage"
import RedirectButton from "@/components/redirect/Button"
import {
  fetchCastConversation,
  fetchCastsReactionsUntilCovered,
  fetchGeneratedPostSummary,
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
  const userFilterParam = parseQueryParam(searchParams.connected)

  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined
  let { data: post } =
    source === "farcaster"
      ? await fetchNormalizedCast(params.id, Number(userFilterParam))
      : await fetchNormalizedTweet(params.id)
  const overallPosts = await fetchPosts({
    timePeriod: timeFilterParam ?? "30-days",
    channelId: "someone-build",
    userFID: userFilterParam,
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
  const { conversation } =
    source === "farcaster"
      ? await fetchCastConversation(
          post.id,
          Number(userFilterParam.length ? userFilterParam : 0)
        )
      : { conversation: [] }
  const categories = categorizeArrayOfPosts(overallPosts) as Category[]
  const generatedPostSummary = post.text
    ? await fetchGeneratedPostSummary(post.id, post.text)
    : { id: params.id, summary: "" }
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const mobileViewParam = parseQueryParam(searchParams.view)

  let filteredPosts = [post]

  const isError = !filteredPosts.length

  return (
    <>
      <Banner
        titleText="Explore this product request "
        descriptionText="Analyze this product request, see stats, summaries, and who is interested"
      />
      <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-20">
        <PostPageElement
          post={post}
          source={source}
          reactionsObject={reactionsObject}
          notionResults={notionResults}
          conversation={conversation}
          generatedSummary={generatedPostSummary}
        />
      </section>
      <div className="flex flex-col items-start lg:hidden">
        {/* <BottomMobileNav
          filteredPosts={[post]}
          initialCasts={[post]}
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

export default PostPage
