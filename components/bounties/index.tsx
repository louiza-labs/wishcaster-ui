import { useState } from "react"
import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { BountyChannelSelect } from "@/components/bounties/BountyChannel"
import { InteractionsCheckbox } from "@/components/filters/Interactions"
import { sendCast } from "@/app/actions"

interface BountyProps {
  hash: string
}
const Bounty = ({ hash }: BountyProps) => {
  const [bountyText, setBountyText] = useState("")
  const [sendBountyAsReply, setSendBountyAsReply] = useState(false)
  const [sendBountyInChannel, setSendBountyInChannel] = useState(false)
  const [channelToSendBountyIn, setChannelToSendBountyIn] = useState("")
  const [sendingBounty, setSendingBounty] = useState(false)
  const [embedsInBountyText, setEmbedsInBountyText] = useState<any | []>([])
  const [errorSendingBounty, setErrorSendingBounty] = useState(false)
  const [sentBounty, setSentBounty] = useState(false)
  const { user } = useNeynarContext()

  const characterLimit = 320
  const remainingCharacters = characterLimit - bountyText.length
  const isExceeded = remainingCharacters < 0

  const handleBountyTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSentBounty(false)

    setBountyText(e.target.value)
  }

  const handleSubmitBounty = async () => {
    if (isExceeded) {
      alert("Character limit exceeded")
      return // Early exit if character limit is exceeded
    }
    // Extract URLs just before submission
    const urlRegex =
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/gi

    const extractedURLs = bountyText.match(urlRegex) || []
    setEmbedsInBountyText(
      extractedURLs.map((embed) => ({
        url: embed,
      }))
    )
    if (bountyText && user && user.signer_uuid) {
      if (!bountyText.includes("@bountybot")) {
        alert("Please make sure you include @bountybot")
        return
      }
      try {
        setSendingBounty(true)
        setErrorSendingBounty(false)

        const signer = user.signer_uuid
        const response = await sendCast(
          signer,
          bountyText,
          sendBountyAsReply ? hash : "",
          embedsInBountyText,
          channelToSendBountyIn ? channelToSendBountyIn : "",
          user.fid
        )
        setSendingBounty(false)
        if (response?.hash && response.hash.length) {
          setSentBounty(true)
        }
      } catch (e) {
        setErrorSendingBounty(true)
        setSendingBounty(false)
      }
    }
  }

  const handleBountyChannelChange = (val: any) => {
    setChannelToSendBountyIn(val)
  }

  const handleSetAsReplyChange = () => {
    setSendBountyAsReply(!sendBountyAsReply)
  }
  const handleSetCastInChannelChange = (value: any) => {
    setSendBountyInChannel(value)
  }

  const canPostABounty =
    (user && user.power_badge) || (user && user.fid <= 20939)

  return (
    <div className="flex w-full flex-col items-start">
      {user && user.fid && canPostABounty ? (
        <>
          <div className="flex w-full flex-col gap-y-2">
            <div className="flex flex-col">
              <p className="font-bold">Options</p>
              <div className="my-2 flex flex-wrap gap-2">
                <InteractionsCheckbox
                  id={"is_reply"}
                  value={sendBountyAsReply}
                  handleChange={handleSetAsReplyChange}
                  text={"Cast as a reply"}
                />
                <InteractionsCheckbox
                  id={"cast_in_channel"}
                  value={sendBountyInChannel}
                  handleChange={handleSetCastInChannelChange}
                  text={"Cast in channel"}
                />
              </div>
            </div>
            {sendBountyInChannel ? (
              <BountyChannelSelect
                value={channelToSendBountyIn}
                handleChange={handleBountyChannelChange}
              />
            ) : null}
            <Label className="my-2">
              Make sure to tag <span className="font-semibold">@bountybot</span>{" "}
              before submitting
            </Label>
            <Textarea
              placeholder="0.1 ETH for fixing this issue [link] in the next 2 weeks. Please share any relevant experience and confirm with me first before working on this @bountybot"
              value={bountyText}
              onChange={handleBountyTextChange}
            />

            {isExceeded && (
              <p className="text-red-500">
                Characters exceeded by {Math.abs(remainingCharacters)}
              </p>
            )}
            <p className="my-1 font-light">
              Characters remaining: {remainingCharacters}
            </p>

            <Button
              onClick={handleSubmitBounty}
              variant={
                errorSendingBounty
                  ? "destructive"
                  : sendingBounty
                  ? "outline"
                  : "secondary"
              }
              className={cn("w-full", sendingBounty ? "animate:shimmer" : "")}
              disabled={isExceeded}
            >
              {sentBounty
                ? "Submitted Bounty"
                : sendingBounty
                ? "Submitting"
                : errorSendingBounty
                ? "Error Submitting Bounty"
                : "Submit bounty"}
            </Button>
          </div>
        </>
      ) : user && !canPostABounty ? (
        <div className="mt-4 flex flex-col items-center gap-y-4">
          <p className="underline-never pb-4 text-center text-base font-extrabold leading-tight tracking-tighter sm:text-lg  md:text-xl">
            You don&apos;t meet the criteria for posting a bounty 🥺
          </p>
          <ul className="flex flex-col items-center gap-y-2 text-lg">
            <li className="font-semibold">Having a Power Badge</li>
            <li className="font-light">OR</li>
            <li className="font-semibold">Having an FID Below 20,939</li>
          </ul>
          <a
            href={"https://www.bountycaster.xyz/start/bounty"}
            target="_blank"
            rel={"noReferrer"}
            className="mt-10 font-semibold"
          >
            Visit BountyCaster to Learn More
          </a>
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-col items-center gap-y-4">
          <Button variant={"outline"}>
            <NeynarAuthButton
              variant={SIWN_variant.FARCASTER}
              label="Connect Farcaster"
              className="text-inter dark:text-white rounded-sm border border-slate-200 bg-transparent shadow-none"
            />
          </Button>
          <div className="flex w-full flex-row items-center justify-center gap-x-1">
            <Separator className="w-1/4" />
            <p className="mx-2 font-medium">or</p>
            <Separator className="w-1/4" />
          </div>
          <Button
            variant={"outline"}
            onClick={() =>
              window.open("https://www.bountycaster.xyz/", "_blank")
            }
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
