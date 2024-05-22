import { siteConfig } from "@/config/site"
import { MainFooter } from "@/components/main-footer"

export function SiteFooter() {
  return (
    <footer className="bg-background absolute bottom-0 z-40 flex w-full flex-row justify-center border-t shadow-md">
      <div className="container flex h-16 items-center space-x-4 sm:justify-center sm:space-x-0">
        <MainFooter items={siteConfig.mainFooter} />

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="size-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="size-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link> */}
          </nav>
        </div>
      </div>
    </footer>
  )
}
