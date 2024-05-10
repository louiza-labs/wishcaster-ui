import { Cast as CastType, Category } from "@/types"

import {
  addCategoryFieldsToCasts,
  filterDuplicateCategories,
  searchCastsForCategories,
  searchCastsForTerm,
} from "@/lib/helpers"
import Categories from "@/components/categories"
import CastFeed from "@/components/feed/Casts"
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

  const casts = (await fetchChannelCasts("someone-build")) as CastType[]
  let filteredCasts = casts

  // Filter by search term if it exists
  if (searchTerm && searchTerm.length) {
    filteredCasts = searchCastsForTerm(filteredCasts, searchTerm)
  }

  const categories = (await categorizeCastsAsRequests(
    filteredCasts
  )) as Category[]
  const filteredCategories = filterDuplicateCategories(categories)

  const castsWithCategories = addCategoryFieldsToCasts(
    filteredCasts,
    categories
  )
  if (categoryParam && categoryParam.length) {
    filteredCasts = searchCastsForCategories(castsWithCategories, categoryParam)
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          What people want! <br className="hidden sm:inline" />
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Sourced directly from Farcaster&apos;s{" "}
          <span className="font-bold">someone-build channel</span>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {filteredCasts && filteredCasts.length ? (
          <>
            <Categories categories={filteredCategories} />
            <CastFeed casts={filteredCasts} />
          </>
        ) : (
          <div className="flex flex-col items-center gap-y-4">
            <h6 className="mt-20 text-center text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              No casts found 😭
            </h6>
            <RedirectButton path={"/"} buttonText="Clear Search" />
          </div>
        )}
      </div>
    </section>
  )
}
