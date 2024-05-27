import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  const items = siteConfig.mainFooter
  return (
    <footer className="bg-background absolute bottom-0 z-40 flex w-full flex-col items-center justify-between gap-y-2 border-t px-4 shadow-md md:flex-row md:gap-y-0">
      <div className="flex flex-row justify-start gap-6 md:gap-10">
        {items?.map((item, index) => (
          <p
            key={item.title}
            className={cn(
              "text-muted-foreground  items-center justify-center text-sm font-medium"
            )}
          >
            {item.title}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <p
          className={cn(
            "text-muted-foreground items-center  justify-center text-sm font-medium md:whitespace-nowrap"
          )}
        >
          Powered by Neynar
        </p>
        <img
          src={"https://files.readme.io/746d54c-logo-purple.svg"}
          alt="neynar-logo"
          className="size-10"
        />
      </div>
    </footer>
  )
}
