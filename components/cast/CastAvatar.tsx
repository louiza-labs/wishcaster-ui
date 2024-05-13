import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CardDescription, CardTitle } from "@/components/ui/card"

interface CastAvatarProps {
  author: any
  category: string | null | undefined
  handleToggleCategoryClick: any
  badgeIsToggled: boolean
}

const CastAvatar = ({
  author,
  category,
  handleToggleCategoryClick,
  badgeIsToggled,
}: CastAvatarProps) => {
  return (
    <div className="flex flex-row justify-between">
      <a
        href={`https://www.warpcast.com/${author.username}`}
        target="_blank"
        rel="noReferrer"
      >
        <div className="flex flex-row items-center gap-x-2">
          <Avatar className="size-10">
            <AvatarImage src={author.pfp_url} alt={author.username} />
          </Avatar>
          <div className="flex flex-col items-start gap-x-4">
            <CardTitle className="text-sm">{author.display_name}</CardTitle>
            <CardDescription className="whitespace-nowrap text-xs">
              {author.username}
            </CardDescription>
          </div>
        </div>
      </a>
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
  )
}

export default CastAvatar
