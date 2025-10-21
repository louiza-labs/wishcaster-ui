import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
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

export default function PopularTopicCard({
  name,
  likes,
  replies,
  recasts,
  rank,
  count,
  handleClick,
  id,
}: PopularTopicCardProps) {
  function formatNumber(value: number): string {
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1) + "B"
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + "M"
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + "K"
    } else {
      return value.toString()
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden border shadow-lg">
      <div className="relative flex h-full flex-col p-6">
        <Badge className="absolute right-4 top-4 bg-primary px-2 py-1 text-primary-foreground">
          Rank #{rank}
        </Badge>
        <h2 className="mb-6 text-lg font-bold text-primary">{name}</h2>
        <div className="mb-6 grid grid-cols-2 gap-6">
          <Stat
            icon={<Icons.likes className="size-4 shrink-0 text-primary" />}
            value={formatNumber(likes)}
            label={likes === 1 ? "Like" : "Likes"}
          />
          <Stat
            icon={<Icons.recasts className="size-4 shrink-0 text-primary" />}
            value={formatNumber(recasts)}
            label={recasts === 1 ? "Repost" : "Reposts"}
          />
          <Stat
            icon={<Icons.replies className="size-4 shrink-0 text-primary" />}
            value={formatNumber(replies)}
            label={replies === 1 ? "Reply" : "Replies"}
          />
          <Stat
            icon={<Icons.boxes className="size-4 shrink-0 text-primary" />}
            value={formatNumber(count)}
            label={"Count"}
          />
        </div>
        <CardFooter className="mt-auto p-0">
          <Button
            className="w-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => handleClick(id)}
          >
            Explore {"-->"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

interface StatProps {
  icon: any

  value: string
  label: string
}

function Stat({ icon, value, label }: StatProps) {
  return (
    <div className="flex items-center space-x-4 rounded-lg border bg-background/40 p-3 shadow-sm backdrop-blur-sm">
      <div className="rounded-full w-10 h-10  flex flex-col items-center justify-center  bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm font-bold text-foreground">{value}</div>
        {/* <div className="text-xs text-muted-foreground">{label}</div> */}
      </div>
    </div>
  )
}
