"use client"

import { useState } from "react"
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { InteractionsCheckbox } from "@/components/filters/Interactions"

interface BountyProps {
  hash: string
}
const Bounty = ({ hash }: BountyProps) => {
  const [bountyText, setBountyText] = useState("")
  const [openBounty, setOpenBounty] = useState(false)
  const [sendBountyAsReply, setSendBountyAsReply] = useState(false)
  const [sendBountyInChannel, setSendBountyInChannel] = useState(false)
  const [sendingBounty, setSendingBounty] = useState(false)
  const [errorSendingBounty, setErrorSendingBounty] = useState(false)
  const [sentBounty, setSentBounty] = useState(false)
  const { user } = useNeynarContext()
  console.log("the user", user)
  const visitBountyCaster = () => {
    if (typeof window !== "undefined") {
      window.open("https://www.bountycaster.xyz/", "_blank")
    }
  }

  const handleBountyTextChange = (e) => {
    setBountyText(e.target.value)
  }

  const handleSubmitBounty = () => {
    if (bountyText && bountyText.length && user && user.signer_uuid) {
      if (bountyText.includes("@bountybot")) {
        const signer = user.signer_uuid

        console.log("good")
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-start">
      {user && user.fid ? (
        <>
          <div className="flex w-full flex-col gap-y-2">
            <div className="flex flex-col">
              <p className="font-bold">Options</p>
              <div className="my-2 flex flex-wrap gap-2">
                <InteractionsCheckbox
                  id={"is_reply"}
                  value={false}
                  handleChange={() => {}}
                  text={"Cast as a reply"}
                />
                <InteractionsCheckbox
                  id={"cast_in_channel"}
                  value={false}
                  handleChange={() => {}}
                  text={"Cast in channel"}
                />
              </div>
            </div>
            <Label>
              {" "}
              Make sure to tag <span className="font-semibold">
                @bountybot
              </span>{" "}
              before submitting
            </Label>
            <Textarea value={bountyText} onChange={handleBountyTextChange} />
            <Button
              onClick={handleSubmitBounty}
              variant={"secondary"}
              className="w-full"
            >
              Submit bounty
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center gap-y-4">
          <div className="flex flex-col items-center gap-y-6">
            <Button variant={"outline"}>
              <NeynarAuthButton
                variant={SIWN_variant.FARCASTER}
                label="Connect Farcaster"
                className="text-inter rounded-sm border border-slate-200 bg-transparent shadow-none"
              />{" "}
            </Button>
            <div className="flex w-full flex-row items-center justify-center gap-x-1">
              <Separator className="w-1/4" />
              <p className="mx-2 font-medium">or</p>
              <Separator className="w-1/4" />
            </div>
          </div>

          <Button
            variant={"outline"}
            onClick={visitBountyCaster}
            className="flex flex-row justify-start gap-x-5 py-1 font-bold"
          >
            <img
              src="https://www.bountycaster.xyz/_next/static/media/logo.480ea057.png"
              alt={"BountyCaster Logo"}
              className="full size-8 rounded"
            />
            Post on BountyCaster
          </Button>
        </div>
      )}
    </div>
  )
}

export default Bounty
