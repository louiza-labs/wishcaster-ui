"use client"

import Autoplay from "embla-carousel-autoplay"

import { getTopUsersByMetric, rankUsers } from "@/lib/helpers"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface CastAvatarProps {
  author: any
  category?: string | null | undefined
  handleToggleCategoryClick?: any
  badgeIsToggled?: boolean
  isTweet?: boolean
  ranking: number
}

const RankedUser = ({
  author,
  category,
  handleToggleCategoryClick,
  badgeIsToggled,
  isTweet,
  ranking,
}: CastAvatarProps) => {
  if (!author) return <div />
  return (
    <Card className="min-size-full overflow-hidden rounded-2xl">
      <div className="relative h-20 bg-[#8c7ae6]">
        <Badge
          variant={"secondary"}
          className=" absolute left-4 top-4 flex w-fit flex-col items-center font-semibold"
        >
          <p className="font-bold">
            Rank
            <span className="ml-2">{ranking}.</span>
          </p>
        </Badge>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <Avatar className="size-16 ring-4 ring-background">
            <AvatarImage src={author.profile_image_url} />
          </Avatar>
        </div>
      </div>
      <CardContent className="px-5 pb-5 pt-10 text-center">
        <div className="flex flex-row items-start justify-center gap-x-2 space-y-2">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">{author.name}</h3>
            <div className="text-sm text-muted-foreground">
              @{author.username}
            </div>
          </div>
          {author.verified ? (
            <Avatar className=" size-4  text-xs">
              <AvatarImage
                className=""
                src={"/social-account-logos/Twitter_Verified_Badge.png"}
              />
            </Avatar>
          ) : null}
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          {author.description}{" "}
        </div>
      </CardContent>
    </Card>
  )
}

interface RankedUsersProps {
  tweets: any
}
const RankedUsers = ({ tweets }: RankedUsersProps) => {
  const rankedUsers = rankUsers(tweets, "")
  const topLikedUsers = getTopUsersByMetric(rankedUsers, "likes_count", 5)

  const handleUserClick = (username: string) => {
    if (typeof window !== "undefined") {
      const profileUrlOnTwitter = `https://x.com/${username}`

      window.open(profileUrlOnTwitter, "_blank")
    }
  }

  return (
    <div className="flex h-fit w-full flex-row items-center gap-x-4 overflow-x-scroll">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          slidesToScroll: 3,
        }}
        plugins={[
          Autoplay({
            delay: 10000,
          }),
        ]}
        className="col-span-4  size-fit"
      >
        <CarouselContent className="-ml-1 size-fit">
          {topLikedUsers.map((user, index) => (
            <CarouselItem
              className=" basis:1 w-fit pl-2  md:basis-1/3"
              key={user.userDetails.id}
            >
              <div onClick={() => handleUserClick(user.userDetails.username)}>
                <RankedUser
                  author={user.userDetails}
                  isTweet={true}
                  category={tweets.categoryLabel}
                  badgeIsToggled={false}
                  ranking={index + 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default RankedUsers
