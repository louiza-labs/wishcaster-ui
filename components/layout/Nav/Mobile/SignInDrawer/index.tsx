"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"

import useIntegrations from "@/hooks/integrations/useIntegrations"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

function parseQueryParam(param?: string | string[]): string {
  return Array.isArray(param) ? param.join(",") : param || ""
}

interface IntegrationsCardProps {
  title: string
  description: string
  image: string
  handleClick: any
  isConnected: boolean
}

const IntegrationsDropdownItem = ({
  title,
  description,
  image,
  handleClick,
  isConnected,
}: IntegrationsCardProps) => {
  const { logoutUser, user } = useNeynarContext()

  return (
    <div
      onClick={handleClick}
      className="flex w-full cursor-pointer flex-row justify-between"
    >
      <div className="flex flex-row items-center gap-x-2">
        <Avatar className="size-6 rounded-full shadow-sm">
          <AvatarImage className="p-0.5" src={image} alt={"name"} />
        </Avatar>
        <span className="text-lg font-medium">{title}</span>
      </div>
      <span>
        {" "}
        {isConnected ? <Icons.circledCheck /> : <Icons.dottedCircle />}
      </span>
    </div>
  )
}

function SignInDrawer() {
  const { integrationOptions, connectedIntegrationImages } = useIntegrations()

  const [open, setOpen] = React.useState(false)
  const searchParams = useSearchParams()
  const { logoutUser, user } = useNeynarContext()
  return (
    <React.Suspense>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2  px-2 text-base font-semibold hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Icons.Integrations />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className={`${
            user && user.pfp_url ? "h-[80vh]" : "h-[35vh]"
          } rounded-t-xl`}
        >
          <div className="flex flex-col items-start gap-y-1">
            <span className="ml-0 text-2xl font-bold"> Connect accounts </span>
            <span className="ml-0 text-lg font-light">
              {" "}
              Sign into Farcaster to connect more accounts
            </span>
          </div>

          <ScrollArea className="mt-6 flex h-[calc(100vh-8rem)] flex-col items-center justify-center pb-2 ">
            <div className="flex size-full flex-col items-center justify-start gap-y-4">
              <Button
                variant={"outline"}
                className=" whitespace-nowrap font-semibold"
              >
                <NeynarAuthButton
                  variant={SIWN_variant.FARCASTER}
                  label="Connect Farcaster"
                  className="text-inter bg-transparent shadow-none dark:text-white"
                />{" "}
              </Button>
              {user && user.pfp_url ? (
                <>
                  {integrationOptions.map((integration: any) => (
                    <IntegrationsDropdownItem
                      title={integration.label}
                      description={integration.description}
                      image={integration.image}
                      handleClick={integration.onClick}
                      isConnected={integration.isConnected}
                      key={integration.label}
                    />
                  ))}
                </>
              ) : null}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </React.Suspense>
  )
}

export default SignInDrawer
