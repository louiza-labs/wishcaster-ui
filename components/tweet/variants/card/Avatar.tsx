import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CardTitle } from "@/components/ui/card"

interface CastAvatarProps {
  author: any
  category?: string | null | undefined
  handleToggleCategoryClick?: any
  badgeIsToggled?: boolean
  tagline?: StaticRange
  isTweet?: boolean
}

const CastAvatar = ({
  author,
  category,
  handleToggleCategoryClick,
  badgeIsToggled,
  tagline,
  isTweet,
}: CastAvatarProps) => {
  if (!author) return <div />
  return (
    <div className="flex w-full flex-row justify-between px-4 ">
      <a
        href={`https://www.warpcast.com/${author.username}`}
        target="_blank"
        rel="noReferrer"
      >
        <div className="flex flex-row items-center gap-x-2">
          <Avatar className="size-10">
            <AvatarImage
              src={isTweet ? author.profile_image_url : author.pfp_url}
              alt={author.username}
            />
          </Avatar>
          <div className="flex flex-col items-start gap-y-2 ">
            <CardTitle className="flex flex-row items-center gap-x-1.5 text-sm lg:w-40">
              <span>{isTweet ? author.name : author.display_name} </span>
              {author.verified || author.power_badge ? (
                <div className="flex flex-col items-center rounded-full  bg-purple-600 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="white"
                    className="size-3"
                  >
                    <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
                  </svg>
                </div>
              ) : null}
            </CardTitle>
          </div>
        </div>
      </a>
      <div className="flex flex-col items-start ">
        {category && category.length ? (
          <Badge
            onClick={() => handleToggleCategoryClick(category)}
            variant={badgeIsToggled ? "default" : "outline"}
            className="w-30 h-10 cursor-pointer whitespace-nowrap"
          >
            {category}
          </Badge>
        ) : null}
      </div>
    </div>
  )
}

export default CastAvatar
