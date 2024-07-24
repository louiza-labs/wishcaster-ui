import { DesktopNav } from "@/components/layout/Nav/Desktop"
import { MobileNav } from "@/components/layout/Nav/Mobile"
import { getUsersNotionAccessCode, searchNotion } from "@/app/actions"

export async function SiteHeader() {
  const notionAccessCode = await getUsersNotionAccessCode()
  const notionSearch = notionAccessCode
    ? await searchNotion(notionAccessCode)
    : { results: [] }
  const notionResults = notionSearch.results
  return (
    <>
      <div className="w-full md:hidden">
        <MobileNav notionResults={notionResults} />
      </div>
      <div className="sticky top-0 z-50 hidden   w-full md:block">
        <DesktopNav notionResults={notionResults} />
      </div>
    </>
  )
}
