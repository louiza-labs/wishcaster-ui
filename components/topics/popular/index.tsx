import { Button } from "@/components/ui/button"
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
  id: string
  powerBadges: number
  handleClick: (topic: string) => void
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
  handleClick,
  id,
  powerBadges,
}: PopularTopicCardProps) => {
  return (
    <Card className="hover:brightness-80 relative mb-4 flex h-fit  cursor-pointer flex-col rounded-lg bg-background/50 p-2 backdrop-blur-lg md:mb-0 md:w-60">
      <CardHeader className="flex h-28 flex-col items-start gap-2">
        <CardTitle className="text-2xl font-bold">{rank}</CardTitle>
        <p className="text-2xl font-bold">{name}</p>
      </CardHeader>
      <CardContent className="mt-10 h-28 grow">
        <div className="grid w-full grid-cols-2 gap-4">
          {[
            { icon: Icons.likes, count: likes, noun: "like" },
            { icon: Icons.recasts, count: recasts, noun: "repost" },
            { icon: Icons.replies, count: replies, noun: "reply" },
            { icon: Icons.boxes, count: count, noun: "count" },
          ].map(({ icon: Icon, count, noun }) => (
            <div
              key={noun}
              className="col-span-1 flex items-center gap-x-2 text-sm"
            >
              <Icon className="size-4 text-gray-700" />
              <div className="flex flex-col items-start">
                <p className="font-medium">{count.toLocaleString()}</p>
                <p>
                  {count !== 1 && noun !== "count"
                    ? noun === "reply"
                      ? `replies`
                      : `${noun}s`
                    : noun}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mb-4 mt-10 flex w-full flex-col items-start">
        <Button
          variant={"default"}
          onClick={() => handleClick(id)}
          className=" self-end"
        >
          Explore {"-->"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PopularTopicCard
