import { FC } from "react"

import { dateOptions } from "@/lib/constants"
import {
  filterPostsByKeywordsAndIndustry,
  generateWhimsicalErrorMessages,
  getTopKeywords,
} from "@/lib/helpers"
import Banner from "@/components/banner"
import CompanyDashboard from "@/components/company/dashboard"
import RedirectButton from "@/components/redirect/Button"
import { fetchPosts, getCompany } from "@/app/actions"

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
  const companyInfo = await getCompany(
    "0x1295e0b82955ae01408f8ad8aa1a0b313c3da759"
  )
  console.log("the company info", companyInfo)

  const overallPosts = await fetchPosts({
    timePeriod: "7-days",
    channelId: "someone-build",
    userFID: userFilterParam,
  })

  const filteredPosts = filterPostsByKeywordsAndIndustry(
    overallPosts ?? [],
    companyInfo.keywords ?? [],
    companyInfo.industry ?? ""
  )
  const topKeywords = getTopKeywords(
    overallPosts ?? [],
    companyInfo.keywords ?? [],
    companyInfo.industry ?? ""
  )
  console.log("the filteredPosts", filteredPosts)

  const searchTerm = parseQueryParam(searchParams.search)
  const categoryParam = parseQueryParam(searchParams.categories)
  const filtersParam = parseQueryParam(searchParams.filters)
  const mobileViewParam = parseQueryParam(searchParams.view)

  return (
    <>
      <Banner
        titleText="Explore this product request "
        descriptionText="Analyze this product request, see stats, summaries, and who is interested"
      />
      <section className="mx-auto h-fit py-6 md:container sm:px-6 lg:h-auto lg:px-20">
        <CompanyDashboard />
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
