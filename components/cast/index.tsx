import { Cast as CastType } from "@/types"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Cast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  category,
  embeds,
  handleToggleCategoryClick,
  badgeIsToggled,
}: CastType) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row items-center gap-x-2">
            <Avatar className="size-10 ">
              <AvatarImage src={author.pfp_url} alt={author.username} />
              {/* <AvatarFallback>{author</AvatarFallback> */}
            </Avatar>
            <div className="flex flex-col items-start gap-x-4">
              <CardTitle className="text-sm">{author.display_name}</CardTitle>
              <CardDescription className="whitespace-nowrap text-xs">
                {author.username}
              </CardDescription>
            </div>
          </div>
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
      </CardHeader>
      <CardContent>
        <p>{text} </p>
      </CardContent>
      <CardFooter className=" flex flex-row items-center gap-x-4">
        {/* <p>Pin</p> */}

        <p className="gap-x-2 font-bold">
          {reactions.likes_count}{" "}
          <span className="text-muted-foreground text-sm font-bold">Likes</span>
        </p>
        <p className="gap-x-2 font-bold">
          {replies.count}{" "}
          <span className="text-muted-foreground text-sm font-bold">
            Replies
          </span>
        </p>
      </CardFooter>
    </Card>
  )
}

export default Cast
