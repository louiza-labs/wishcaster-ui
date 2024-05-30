import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface PopularTopicCardProps {
  name: string
  description?: string
  likes: number
  replies: number
  recasts: number
  rank: number
  avgFollowers: number
  count: number
  powerBadges: number
}

const PopularTopicCard = ({
  name,
  description,
  likes,
  replies,
  recasts,
  rank,
  avgFollowers,
  count,
  powerBadges,
}: PopularTopicCardProps) => {
  return (
    <Card className="flex h-80 w-60 flex-col items-start justify-between rounded-lg p-2">
      <CardHeader className="flex flex-row items-center gap-x-4">
        <CardTitle className="text-2xl font-bold">{rank}</CardTitle>
        {/* <CardDescription>{description}</CardDescription> */}
      </CardHeader>
      <CardContent>
        {" "}
        <p className="text-2xl font-bold">{name}</p>
      </CardContent>
      <div className="flex w-full flex-row items-start">
        <CardFooter className="grid size-full grid-cols-2 items-start gap-4 gap-y-2">
          {[
            { icon: Icons.likes, count: likes, noun: "like" },
            {
              icon: Icons.recasts,
              count: recasts,
              noun: "recast",
            },
            { icon: Icons.replies, count: replies, noun: "reply" },
            // { icon: Icons.likes, count: powerBadges, noun: "power badge" },
            {
              icon: Icons.recasts,
              count: count,
              noun: "Count",
            },
            // { icon: Icons.replies, count: avgFollowers, noun: "avg follower" },
          ].map(({ icon: Icon, count, noun }) => (
            <div
              key={noun}
              className="col-span-1 flex items-center gap-x-2 text-sm"
            >
              <Icon className="size-4 text-gray-700" />
              <div className="flex flex-col items-start">
                <p className="font-medium">{count.toLocaleString()}</p>
                <p>{count !== 1 ? `${noun}s` : noun}</p>
              </div>
            </div>
          ))}
        </CardFooter>
      </div>
    </Card>
  )
}
export default PopularTopicCard
