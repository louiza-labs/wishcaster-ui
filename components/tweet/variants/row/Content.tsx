import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SaveCast from "@/components/cast/Save/"
import AuthorAvatar from "@/components/cast/variants/TableRow/CastAvatar"
import { Icons } from "@/components/icons"

interface TweetContentProps {
  user: any
  categoryLabel: string
  castWithTagline: any
  likes: number
  replies: number
  retweets: number
  tweet: any
  notionResults: any
  setShowToggle: any
  showToggle: any
}

const TweetContent = ({
  user,
  categoryLabel,
  castWithTagline,
  likes,
  replies,
  retweets,
  tweet,
  notionResults,
  setShowToggle,
  showToggle,
}: TweetContentProps) => {
  const [aspectRatio, setAspectRatio] = useState("56.25%")

  return (
    <CardContent className="grid grid-cols-[48px_1fr_auto] gap-4 p-4 md:p-6">
      <div className="flex flex-row items-end gap-x-4">
        <AuthorAvatar
          author={user}
          isTweet={true}
          category={categoryLabel}
          tagline={castWithTagline.tagline}
          handleToggleCategoryClick={() => {}}
          badgeIsToggled={false}
        />
        <div className="flex flex-col items-start gap-y-2">
          <p className="whitespace-nowrap text-sm font-medium ">
            {castWithTagline.tagline}
          </p>

          <div className=" flex flex-row items-center gap-x-6  ">
            {[
              {
                icon: Icons.likes,
                count: likes,
                noun: "Like",
              },
              {
                icon: Icons.recasts,
                count: retweets,
                noun: "Retweets",
              },
              {
                icon: Icons.replies,
                count: replies,
                noun:
                  replies.count > 1 || replies.count === 0 ? "Replie" : "Reply",
              },
            ].map(({ icon: Icon, count, noun }) => (
              <div
                key={noun}
                className="row flex items-center justify-start gap-x-2"
              >
                <div className="flex flex-row gap-x-2">
                  <Icon
                    style={{ width: "18px", height: "18px" }}
                    className="size-1 text-muted-foreground"
                  />
                  {/* <p className="whitespace-nowrap ">
                {count !== 1 ? `${noun}s` : noun}
              </p> */}
                </div>
                <div className="flex flex-col items-start">
                  <p className="whitespace-nowrap text-xs font-semibold text-muted-foreground">
                    {count.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <MoveHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Icons.Integrations className="mr-2 size-4" />
              <SaveCast
                cast={tweet}
                notionResults={notionResults}
                isOnTweetsPage={true}
              />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Icons.Search className="mr-2 size-4" />
              Explore
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Icons.Rocket className="mr-2 size-4" />
              Visit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full"
          onClick={() => setShowToggle(!showToggle)}
        >
          <ChevronsUpDownIcon className="size-4" />
        </Button>
      </div>
    </CardContent>
  )
}

export default TweetContent

function ChevronsUpDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  )
}

function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}
