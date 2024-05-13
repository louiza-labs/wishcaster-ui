import { Icons } from "@/components/icons"

interface CastFooterProps {
  timestamp: string
  replies: {
    count: number
  }
  reactions: {
    likes_count: number
  }
}

const CastFooter = ({ timestamp, reactions, replies }: CastFooterProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-row items-center gap-x-4">
        <div className="flex flex-row items-center gap-x-2">
          <p className="gap-x-2 font-medium">{reactions.likes_count}</p>
          <Icons.likes className="size-4" />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <p className="gap-x-2 font-medium">{replies.count}</p>
          <Icons.replies className="size-4" />
        </div>
      </div>
      <p className="gap-x-2 font-medium">
        {new Date(timestamp).toLocaleDateString()}
      </p>
    </div>
  )
}

export default CastFooter
