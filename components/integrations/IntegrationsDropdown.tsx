"use client"

import { NeynarAuthButton } from "@neynar/react"

import useIntegrations from "@/hooks/integrations/useIntegrations"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

const IntegrationsDropdown = () => {
  const { integrationOptions, connectedIntegrationImages } = useIntegrations()

  interface IntegrationsCardProps {
    title: string
    description: string
    image: string
    handleClick: any
    isConnected: boolean
    CustomButton?: any
  }

  const IntegrationsDropdownItem = ({
    title,
    description,
    image,
    handleClick,
    isConnected,
    CustomButton,
  }: IntegrationsCardProps) => {
    return (
      <DropdownMenuItem
        onClick={handleClick}
        className="flex cursor-pointer flex-row justify-between"
      >
        {CustomButton ? (
          <NeynarAuthButton />
        ) : (
          <div className="flex flex-row items-center gap-x-2">
            <Avatar className="size-6 rounded-full shadow-sm">
              <AvatarImage className="p-0.5" src={image} alt={"name"} />
            </Avatar>
            <span>{title}</span>
          </div>
        )}
        <span>
          {" "}
          {isConnected ? <Icons.circledCheck /> : <Icons.dottedCircle />}
        </span>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative mr-4 border-none " asChild>
        <Button variant={"ghost"} className="relative">
          <Icons.Integrations />
          {connectedIntegrationImages && connectedIntegrationImages.length ? (
            <div className="absolute -right-0.5 -top-1 flex flex-row items-center gap-x-0.5">
              <div className="flex size-5 flex-col items-center justify-center rounded-full bg-indigo-500 p-1 text-xs font-medium text-white">
                {connectedIntegrationImages.length}
              </div>
            </div>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {integrationOptions.map((integration: any) => (
            <IntegrationsDropdownItem
              title={integration.label}
              description={integration.description}
              image={integration.image}
              handleClick={integration.onClick}
              isConnected={integration.isConnected}
              key={integration.label}
              CustomButton={integration.customButton}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IntegrationsDropdown
