import { Cast as CastType } from "@/types"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
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
  embeds,
}: CastType) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-x-4">
          <Avatar>
            <AvatarImage src={author.pfp_url} alt={author.username} />
            {/* <AvatarFallback>{author</AvatarFallback> */}
          </Avatar>
          <div className="flex flex-col items-start">
            <CardTitle>{author.display_name}</CardTitle>
            <CardDescription>{author.username}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
      <CardFooter>{/* <p>Pin</p> */}</CardFooter>
    </Card>
  )
}

export default Cast
