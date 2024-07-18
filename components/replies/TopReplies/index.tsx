"use client"

import { sortCastsByProperty } from "@/lib/helpers"
import useFetchCastConversation from "@/hooks/farcaster/conversations/useFetchCastConversation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Cast from "@/components/cast/variants/SprintItem"

interface TopRepliesProps {
  castHash: string
  notionResults?: any
}
const TopReplies = ({ castHash, notionResults }: TopRepliesProps) => {
  const { conversation } = useFetchCastConversation(castHash)
  const sortedRepliesByLikes = sortCastsByProperty(conversation, "likes_count")
  const topFiveRepliesByLikes = sortedRepliesByLikes.slice(0, 5)

  return (
    <div className="z-30 mt-2 flex h-full flex-col gap-y-4 overflow-y-auto px-4 md:px-0">
      {topFiveRepliesByLikes && topFiveRepliesByLikes.length ? (
        <Accordion type="single" defaultChecked={true} collapsible className="">
          <AccordionItem value="replies">
            <AccordionTrigger className="mt-2 text-xl font-bold  md:flex md:text-2xl">
              <p>Top Replies</p>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-y-2">
              {topFiveRepliesByLikes && topFiveRepliesByLikes.length
                ? topFiveRepliesByLikes.map((reply: any) => (
                    <Cast
                      {...reply}
                      key={reply.hash}
                      hideMetrics={false}
                      badgeIsToggled={false}
                      isReply={true}
                      notionResults={notionResults}
                      cast={reply}
                      mentionedProfiles={reply.mentioned_profiles}
                    />
                  ))
                : null}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
    </div>
  )
}

export default TopReplies
