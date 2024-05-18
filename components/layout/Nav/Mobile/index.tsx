import { Icons } from "@/components/icons"
import Drawer from "@/components/layout/Nav/Mobile/Drawer"

export function MobileNav() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <nav className="container flex h-16 w-full flex-row items-center justify-between md:hidden">
        <Icons.logo />
        <Drawer />
      </nav>
    </header>
  )
}
