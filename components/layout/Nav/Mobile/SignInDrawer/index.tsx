"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

function SignInDrawer() {
  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()
  const { logoutUser, user } = useNeynarContext()
  return (
    <React.Suspense>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 mt-2 px-0 font-semibold text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            Sign In to FC
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[25vh] rounded-t-xl">
          <span className="ml-2 text-3xl font-bold"> Sign In </span>
          <ScrollArea className="mt-6 flex h-[calc(100vh-8rem)] flex-col items-center justify-center pb-2 ">
            <div className="flex flex-col items-center justify-center">
              <Button
                variant={"secondary"}
                className=" whitespace-nowrap font-semibold"
              >
                <NeynarAuthButton
                  variant={SIWN_variant.FARCASTER}
                  label="Connect Farcaster"
                  className="text-inter bg-transparent dark:text-white shadow-none"
                />{" "}
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </React.Suspense>
  )
}

export default SignInDrawer
