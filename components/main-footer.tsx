import Link from "next/link"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

interface MainFooterProps {
  items?: NavItem[]
}

export function MainFooter({ items }: MainFooterProps) {
  return (
    <div className="flex w-full flex-col justify-center gap-2 py-2 md:flex-row md:gap-3">
      {/* <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="size-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link> */}
      <div className="flex w-full flex-row justify-center gap-6 md:gap-10">
        {items?.length ? (
          <div className="flex  items-center justify-center gap-6">
            {items?.map((item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground flex items-center text-sm font-medium",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ) : (
                <p
                  key={item.title}
                  className={cn(
                    "text-muted-foreground  items-center justify-center text-sm font-medium",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </p>
              )
            )}
          </div>
        ) : null}
      </div>
      <div className="flex  items-center justify-center gap-6">
        <p
          className={cn(
            "text-muted-foreground items-center  justify-center text-sm font-medium md:whitespace-nowrap"
          )}
        >
          Powered by Neynar
        </p>
      </div>
    </div>
  )
}
