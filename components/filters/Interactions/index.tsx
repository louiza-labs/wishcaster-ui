"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface IntereractionsCheckboxProps {
  id: string
  text: string
  handleChange: (val: boolean) => void
  value: boolean
  isDisabled?: boolean
}

export function InteractionsCheckbox({
  id,
  text,
  handleChange,
  value,
  isDisabled,
}: IntereractionsCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        disabled={isDisabled}
        onCheckedChange={handleChange}
        checked={value}
        id={id}
      />
      <>
        {id === "twitter" ? (
          <Avatar className="flex size-8 flex-col items-center rounded-full   p-1 ">
            <AvatarImage
              src={"/social-account-logos/twitter-logo-black.png"}
              alt={"twitter"}
              className="rounded-full border shadow"
            />
          </Avatar>
        ) : id === "farcaster" ? (
          <Avatar className="flex size-8 flex-col items-center rounded-full   p-1 ">
            <AvatarImage
              src={"/social-account-logos/farcaster-purple-white.png"}
              alt={"farcaster"}
              className="rounded-full border shadow"
            />
          </Avatar>
        ) : null}
        {id === "twitter" || id === "farcaster" ? null : (
          <label
            htmlFor={id}
            className="break-all text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {text}
          </label>
        )}
      </>
    </div>
  )
}
