import { DesktopNav } from "@/components/layout/Nav/Desktop"
import { MobileNav } from "@/components/layout/Nav/Mobile"

export function SiteHeader() {
  return (
    <>
      <div className="w-full md:hidden">
        <MobileNav />
      </div>
      <div className="hidden w-full md:block">
        <DesktopNav />
      </div>
    </>
  )
}
