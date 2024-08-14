import { FC } from "react"

import { dateOptions } from "@/lib/constants"
import { generateWhimsicalErrorMessages } from "@/lib/helpers"
import RedirectButton from "@/components/redirect/Button"
import ValidateSearch from "@/components/search/ValidateSearch"
import { getUsersNotionAccessCode, searchNotion } from "@/app/actions"

interface IndexPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
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

const ValidatePage: FC<IndexPageProps> = async ({ searchParams }) => {
  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = await searchNotion(notionAccessCode)

  return (
    <>
      <section className="relative mx-auto p-6 md:container sm:px-6 lg:px-20">
        <main className="relative grid grid-cols-1 gap-4 py-10 lg:grid-cols-12 ">
          <article className="no-scrollbar flex flex-col items-center lg:col-span-12 lg:px-2  ">
            <Header />
            <ValidateSearch />
          </article>
        </main>
      </section>
      <div className="flex flex-col items-start lg:hidden">
        {/* <BottomMobileNav
          filteredPosts={filteredPosts}
          initialCasts={initialCasts}
          page={"topics"}
        /> */}
      </div>
    </>
  )
}

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  return (
    <div className="flex flex-col items-center gap-2 md:items-start">
      <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-center md:text-4xl">
        See the demand for your idea
      </h1>
      {/* <p className="text-center text-xs sm:text-lg md:text-left lg:max-w-[700px]">
        Sourced from Farcaster&apos;s{" "}
        <span className="font-bold">someone-build channel</span>
      </p> */}
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

export default ValidatePage
