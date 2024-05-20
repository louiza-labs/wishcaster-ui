import { FC } from "react"
import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  generateWhimsicalErrorMessages,
  searchCastsForCategories,
  sortCastsByProperty,
} from "@/lib/helpers"
import CastsFeed from "@/components/feed/casts"
import Filters from "@/components/filters"
import MobileSortingAndFiltering from "@/components/mobile/SortingAndFiltering"
import MobileRankings from "@/components/mobile/rankings"
import Rankings from "@/components/rankings"
import RedirectButton from "@/components/redirect/Button"
import SortCasts from "@/components/sort/SortCasts"
import { fetchChannelCasts } from "@/app/actions"

interface IndexPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

const IndexPage: FC<IndexPageProps> = async ({ searchParams }) => {
  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const sortParam = parseQueryParam(searchParams.sort)

  const { casts: initialCasts, nextCursor: cursorToUse } =
    await fetchChannelCasts("someone-build")
  let filteredCasts = initialCasts
  const categories = categorizeArrayOfCasts(filteredCasts) as Category[]

  filteredCasts = addCategoryFieldsToCasts(
    filteredCasts,
    categories
  ) as Array<CastType>
  if (categoryParam.length) {
    filteredCasts = searchCastsForCategories(filteredCasts, categoryParam)
  }
  if (sortParam) {
    filteredCasts = sortCastsByProperty(filteredCasts, sortParam)
  }

  const isError = !filteredCasts.length

  return (
    <section className="container mx-auto  py-6 sm:px-6 lg:px-20">
      <div className="flex flex-row items-start gap-x-4">
        <Header />
        <div className="relative block md:hidden">
          <MobileSortingAndFiltering
            filteredCasts={filteredCasts}
            initialCasts={initialCasts}
          />
        </div>
      </div>
      <main className="relative grid grid-cols-1 gap-4  sm:grid-cols-12 sm:gap-x-10">
        <aside className="md:hidden">
          <MobileRankings casts={filteredCasts} />
        </aside>
        <aside className="relative hidden flex-col  gap-y-6 sm:col-span-3 sm:flex">
          <SortCasts />
          <Filters initialCasts={initialCasts} />
        </aside>
        <article className="sm:col-span-6">
          {isError ? (
            <ErrorDisplay searchTerm={searchTerm} filtersParam={filtersParam} />
          ) : (
            <CastsFeed casts={filteredCasts} nextCursor={cursorToUse} />
          )}
        </article>
        <aside className="relative hidden gap-y-6 sm:sticky sm:col-span-3 sm:flex sm:flex-col">
          <Rankings casts={filteredCasts} />
        </aside>
      </main>
    </section>
  )
}

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex flex-col items-center gap-2 pb-10 md:items-start">
      <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
        What people want! <br className="hidden sm:inline" />
      </h1>
      <p className="text-center text-sm sm:text-lg md:text-left lg:max-w-[700px]">
        Sourced directly from Farcaster&apos;s{" "}
        <span className="font-bold">someone-build channel</span>
      </p>
    </div>
  )
}

interface ErrorDisplayProps {
  searchTerm: string
  filtersParam: string
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ searchTerm, filtersParam }) => {
  return (
    <>
      <div className="col-span-12 flex flex-col items-center gap-y-4">
        <h6 className="mt-20 text-xl font-extrabold leading-tight tracking-tighter sm:text-3xl">
          There is an issue getting casts 😭
        </h6>
        <h5 className="mt-4 text-lg font-light leading-tight tracking-tighter sm:text-2xl">
          {generateWhimsicalErrorMessages()}
        </h5>
        {(searchTerm.length || filtersParam.length) && (
          <RedirectButton path={"/"} buttonText="Clear Search" />
        )}
      </div>
    </>
  )
}

export default IndexPage
