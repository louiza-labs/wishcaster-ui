import MobileFiltering from "@/components/layout/Nav/Mobile/Bottom/Filters"
import MobileRankings from "@/components/layout/Nav/Mobile/Bottom/Rankings"
import MobileSearch from "@/components/layout/Nav/Mobile/Bottom/Search"
import MobileSorting from "@/components/layout/Nav/Mobile/Bottom/Sort"

const BottomMobileNav = ({ initialCasts, filteredCasts }) => {
  return (
    <div className="bg-background fixed bottom-0 z-40 flex h-20 w-full flex-row items-center justify-around gap-x-10 overflow-hidden border-t px-0">
      <MobileSearch />
      <MobileFiltering
        initialCasts={initialCasts}
        filteredCasts={filteredCasts}
      />
      <MobileRankings initialCasts={initialCasts} />
      <MobileSorting />
    </div>
  )
}

export default BottomMobileNav
