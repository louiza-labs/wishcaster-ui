"use client"

import { Suspense, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

function TopicsNavButton({}: any) {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  const router = useRouter()

  const handleClick = () => {
    router.push("/topics")
  }

  return (
    <Suspense>
      <Button
        onClick={handleClick}
        variant="ghost"
        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
      >
        <div className="flex flex-col items-center">
          <Icons.boxes />
          <p
            className={
              path === "topics" ? "text-xs font-bold" : "text-xs font-medium"
            }
          >
            Topics
          </p>
        </div>
      </Button>
    </Suspense>
  )
}

export default TopicsNavButton
