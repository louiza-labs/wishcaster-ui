"use client"

import useFetchCastConversation from "@/hooks/farcaster/conversations/useFetchCastConversation"
import Team from "@/components/team"

interface BuildProps {
  hash: string
  cast: any
  reactions: any
  hideBounties?: boolean
}
const BuildComponent = ({
  hash,
  cast,
  reactions,
  hideBounties,
}: BuildProps) => {
  const { conversation } = useFetchCastConversation(cast.hash)

  const castsWithBountyBotText = conversation.filter((cast: any) =>
    cast.text.includes("@bountybot")
  )

  return (
    <div className="flex w-full flex-col">
      <Team cast={cast} reactions={reactions} conversation={conversation} />
    </div>
  )
}

export default BuildComponent
