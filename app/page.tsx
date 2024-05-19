import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  categorizeArrayOfCasts,
  filterDuplicateCategories,
  generateWhimsicalErrorMessages,
  searchCastsForCategories,
  searchCastsForTerm,
} from "@/lib/helpers"
import CastsFeed from "@/components/feed/casts"
import Filters from "@/components/filters"
import Rankings from "@/components/rankings/"
import RedirectButton from "@/components/redirect/Button"
import { fetchChannelCasts } from "@/app/actions"

export default async function IndexPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const searchTerm = Array.isArray(searchParams.search)
    ? searchParams.search.join(",")
    : searchParams.search
    ? searchParams.search
    : ""
  const categoryParam = Array.isArray(searchParams.categories)
    ? searchParams.categories.join(",")
    : searchParams.categories
    ? searchParams.categories
    : ""
  const filtersParams = Array.isArray(searchParams.filters)
    ? searchParams.filters.join(",")
    : searchParams.filters
    ? searchParams.filters
    : ""

  const priorityBadgeFilter =
    filtersParams && filtersParams.includes("priority-badge")

  const castsResponse = await fetchChannelCasts("someone-build")
  const castsCursor =
    castsResponse && castsResponse.nextCursor ? castsResponse.nextCursor : ""
  const fetchedCasts =
    castsResponse && castsResponse.casts
      ? castsResponse.casts
      : ([] as CastType[])
  let filteredCasts = fetchedCasts as CastType[]
  if (priorityBadgeFilter) {
    filteredCasts = filteredCasts.filter(
      (cast: CastType) => cast.author.power_badge
    )
  }

  // Filter by search term if it exists
  if (searchTerm && searchTerm.length) {
    filteredCasts = searchCastsForTerm(filteredCasts, searchTerm)
  }

  const categories = categorizeArrayOfCasts(filteredCasts) as Category[]
  const filteredCategories = filterDuplicateCategories(categories)

  filteredCasts = addCategoryFieldsToCasts(
    filteredCasts,
    categories
  ) as Array<CastType>
  if (categoryParam && categoryParam.length) {
    filteredCasts = searchCastsForCategories(filteredCasts, categoryParam)
  }
  return (
    <section className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-2 pb-10 md:items-start">
        <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-left md:text-4xl">
          What people want! <br className="hidden sm:inline" />
        </h1>
        <p className="text-center text-sm sm:text-lg md:text-left lg:max-w-[700px]">
          Sourced directly from Farcaster&apos;s{" "}
          <span className="font-bold">someone-build channel</span>
        </p>
      </div>
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-x-10">
        {filteredCasts && filteredCasts.length ? (
          <>
            <div className="hidden sm:col-span-3 sm:block">
              <Filters filteredCategories={filteredCategories} />
            </div>
            <div className="sm:col-span-6">
              <CastsFeed casts={filteredCasts} nextCursor={castsCursor} />
            </div>
            <div className="hidden gap-y-6 sm:col-span-3  sm:flex sm:flex-col md:sticky md:top-20">
              <Rankings casts={filteredCasts} />
            </div>
          </>
        ) : (
          <div className="col-span-12 flex flex-col items-center gap-y-4">
            <h6 className="mt-20 text-xl font-extrabold leading-tight tracking-tighter sm:text-3xl">
              There is an issue getting or categorizing casts 😭
            </h6>
            <h5 className="mt-4 text-lg font-light leading-tight tracking-tighter sm:text-2xl">
              {generateWhimsicalErrorMessages()}
            </h5>
            {searchTerm && searchTerm.length ? (
              <RedirectButton path={"/"} buttonText="Clear Search" />
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
