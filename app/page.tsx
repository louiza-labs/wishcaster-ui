import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  filterDuplicateCategories,
  generateWhimsicalErrorMessages,
  searchCastsForCategories,
  searchCastsForTerm,
} from "@/lib/helpers"
import CastFeed from "@/components/feed/casts"
import Categories from "@/components/feed/categories"
import Rankings from "@/components/rankings"
import RedirectButton from "@/components/redirect/Button"
import { categorizeCastsAsRequests, fetchChannelCasts } from "@/app/actions"

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

  const castsResponse = await fetchChannelCasts("someone-build")
  const castsCursor =
    castsResponse && castsResponse.nextCursor ? castsResponse.nextCursor : ""
  const casts =
    castsResponse && castsResponse.casts
      ? castsResponse.casts
      : ([] as CastType[])
  let filteredCasts = casts as CastType[]

  // Filter by search term if it exists
  if (searchTerm && searchTerm.length) {
    filteredCasts = searchCastsForTerm(filteredCasts, searchTerm)
  }

  const categories = (await categorizeCastsAsRequests(
    filteredCasts
  )) as Category[]
  const filteredCategories = filterDuplicateCategories(categories)

  filteredCasts = addCategoryFieldsToCasts(
    filteredCasts,
    categories
  ) as Array<CastType>
  if (categoryParam && categoryParam.length) {
    filteredCasts = searchCastsForCategories(filteredCasts, categoryParam)
  }

  return (
    <section className="container grid items-center gap-6 px-20 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-start gap-2 pb-10 ">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          What people want! <br className="hidden sm:inline" />
        </h1>
        <p className="text-muted-foreground text-lg lg:max-w-[700px]">
          Sourced directly from Farcaster&apos;s{" "}
          <span className="font-bold">someone-build channel</span>
        </p>
      </div>
      <div className="relative grid h-full grid-cols-12 gap-x-10 ">
        {filteredCasts && filteredCasts.length ? (
          <>
            <Rankings casts={filteredCasts} />

            <CastFeed casts={filteredCasts} nextCursor={castsCursor} />
            <Categories categories={filteredCategories} />
          </>
        ) : (
          <div className="col-span-12 flex flex-col  items-center gap-y-4">
            <h6 className="mt-20 text-center text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              There is an issue getting or categorizing casts 😭
            </h6>
            <h5 className="mt-4 text-center text-2xl font-light leading-tight tracking-tighter md:text-3xl">
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
