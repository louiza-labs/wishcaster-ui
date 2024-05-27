"use client"

// Adjust the path as necessary
import { useEffect } from "react"
import { useFooterVisibilityStore } from "@/store"
import { useInView } from "react-intersection-observer"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  const { ref, inView } = useInView({
    threshold: 0.1,
  })
  const setFooterVisible = useFooterVisibilityStore(
    (state) => state.setFooterVisible
  )

  useEffect(() => {
    setFooterVisible(inView)
  }, [inView, setFooterVisible])
  const items = siteConfig.mainFooter
  return (
    <footer
      ref={ref}
      className="bg-background z-28 absolute bottom-0 hidden h-28  w-full flex-row  items-center justify-between   border-t px-4 shadow-md sm:flex sm:h-auto md:gap-y-0 lg:absolute"
    >
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
