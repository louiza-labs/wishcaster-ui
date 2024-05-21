"use client"

import { Cast as CastType } from "@/types"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import AuthorAvatar from "@/components/cast/CastAvatar"
import CastContent from "@/components/cast/CastContent"
import CastFooter from "@/components/cast/CastFooter"

const Cast = ({
  timestamp,
  text,
  author,
  parent_url,
  reactions,
  replies,
  category,
  embeds,
  hash,
  handleToggleCategoryClick,
  badgeIsToggled,
}: CastType) => {
  return (
    <Card className="md:border-auto md:shadow-auto flex w-full flex-col justify-between border-none  lg:h-fit">
      <CardHeader>
        <AuthorAvatar
          author={author}
          category={category}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
          timestamp={timestamp}
        />
      </CardHeader>
      <CardContent>
        <CastContent
          text={text}
          embeds={embeds}
          hash={hash}
          author={author}
          handleToggleCategoryClick={handleToggleCategoryClick}
          badgeIsToggled={badgeIsToggled}
          maxCharacters={150}
        />
      </CardContent>
      <CardFooter>
        <CastFooter
          timestamp={timestamp}
          reactions={reactions}
          replies={replies}
        />
      </CardFooter>
    </Card>
  )
}

export default Cast
