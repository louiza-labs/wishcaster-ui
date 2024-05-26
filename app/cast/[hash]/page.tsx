import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import { dateOptions } from "@/lib/constants"
import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  generateWhimsicalErrorMessages,
} from "@/lib/helpers"
import Build from "@/components/build"
import Cast from "@/components/cast"
import CastStats from "@/components/cast/stats"
import BottomMobileNav from "@/components/layout/Nav/Mobile/Bottom"
import RedirectButton from "@/components/redirect/Button"
import TopReplies from "@/components/replies/TopReplies"
import {
  fetchCastsReactionsUntilCovered,
  fetchCastsUntilCovered,
  fetchChannelCasts,
  fetchFarcasterCast,
} from "@/app/actions"

interface CastPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
  hash: string
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

const CastPage: FC<CastPageProps> = async ({ searchParams, params }) => {
  const cast = await fetchFarcasterCast(params.hash)
  const timeFilterParam = searchParams.filters
    ? extractTimeFilterParam(searchParams.filters)
    : undefined
  const { casts: initialCasts, nextCursor: cursorToUse } = !timeFilterParam
    ? await fetchChannelCasts("someone-build")
    : await fetchCastsUntilCovered(
        "someone-build",
        timeFilterParam as "24-hours" | "7-days" | "30-days" | "ytd"
      )
  const { reactionsObject } =
    cast && cast.hash
      ? await fetchCastsReactionsUntilCovered(
          cast?.hash,
          cast?.reactions.likes_count,
          cast?.reactions.recasts_count
        )
      : {
          reactionsObject: {
            likes: [],
            recasts: [],
          },
        }
  let overallChannelCasts = initialCasts
  const categories = categorizeArrayOfCasts([
    ...overallChannelCasts,
    cast,
  ]) as Category[]
  const castWithCategory = cast
    ? addCategoryFieldsToCasts([cast], categories)[0]
    : cast

  overallChannelCasts = addCategoryFieldsToCasts(
    overallChannelCasts,
    categories
  ) as Array<CastType>

  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)

  let filteredCasts = [cast]
  const isError = !filteredCasts.length

  return (
    <>
      <section className="mx-auto py-6 md:container sm:px-6 lg:px-20">
        <div className="flex flex-row items-start gap-x-4">
          {/* <Header /> */}
        </div>
        <main className="relative grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-x-10">
          <article className="no-scrollbar sm:col-span-5">
            {isError ? (
              <ErrorDisplay
                searchTerm={searchTerm}
                filtersParam={filtersParam}
                categoryParam={categoryParam}
              />
            ) : (
              <div className="gap-y-4">
                <div className="bg-background sticky top-20 z-40 flex flex-col gap-y-4">
                  <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                    Cast
                  </h1>
                  <Cast
                    {...castWithCategory}
                    hideMetrics={true}
                    badgeIsToggled={false}
                  />
                </div>
                <TopReplies castHash={castWithCategory.hash} />
              </div>
            )}
          </article>
          <div className=" relative top-0 flex flex-col gap-y-4 sm:col-span-3">
            <div className="sticky top-20 z-40 flex flex-col gap-y-4">
              <h1 className="col-span-12 text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                Stats
              </h1>
              <CastStats
                cast={castWithCategory}
                reactions={reactionsObject}
                overallChannelCasts={overallChannelCasts}
              />
            </div>
          </div>
          <div className="relative top-0 flex flex-col sm:col-span-4">
            <div className="sticky top-20 z-40 flex flex-col">
              <h1 className="col-span-12 text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
                Let&apos;s build
              </h1>
              <Build
                cast={castWithCategory}
                hash={castWithCategory.hash}
                reactions={reactionsObject}
              />
            </div>
          </div>
        </main>
      </section>
      <div className="flex flex-col items-start md:hidden">
        <BottomMobileNav filteredCasts={[]} initialCasts={[]} />
      </div>
    </>
  )
}

interface HeaderProps {}

const Header: FC<HeaderProps> = ({ cast }) => {
  return (
    <div className="flex flex-col items-center gap-2 pb-10 md:items-start">
      <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
        {cast.text}{" "}
      </h1>
      <p className="text-center text-sm sm:text-lg md:text-left lg:max-w-[700px]">
        Sourced from Farcaster&apos;s{" "}
        <span className="font-bold">someone-build channel</span>
      </p>
    </div>
  )
}

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

export default CastPage
