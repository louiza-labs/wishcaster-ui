import { FC } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/clients/supabase/server"
import { FormProvider } from "@/contexts/company"

import { generateWhimsicalErrorMessages } from "@/lib/helpers"
import Banner from "@/components/banner"
import CompanyOnboarding from "@/components/company/onboarding"
import RedirectButton from "@/components/redirect/Button"
import { getCompany } from "@/app/actions/company"

interface IndexPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function getUserFromAuth() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

const CompanyPage: FC<IndexPageProps> = async ({ searchParams }) => {
  const user = await getUserFromAuth()
  const company = user && user.id ? await getCompany(user?.id) : null
  if (company && company.id) {
    redirect(`/company/${company.id}`)
  }

  return (
    <>
      <Banner
        titleText="Research a product idea"
        descriptionText="Research a product idea by industry to see analytics and reports"
      />
      <section className="relative mx-auto p-6 md:container sm:px-6 lg:px-20">
        <main className="relative grid grid-cols-1 gap-4 py-10 lg:grid-cols-12 ">
          <article className="no-scrollbar flex flex-col items-center lg:col-span-12 lg:px-2  ">
            <Header />
            {!user ? (
              <div className="flex flex-col items-center">
                <p className="text-center text-xl font-light leading-tight tracking-tighter md:text-xl">
                  Please sign in above to continue
                </p>
              </div>
            ) : (
              <FormProvider>
                <CompanyOnboarding />
              </FormProvider>
            )}
          </article>
        </main>
      </section>
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

export default CompanyPage
