import { Cast as CastType } from "@/types"

import Cast from "@/components/cast"

interface CastFeedProps {
  casts: CastType[]
}
const CastFeed = ({ casts }: CastFeedProps) => {
  return (
    <div className="grid grid-cols-3 gap-10 p-20">
      {casts && casts.length ? (
        casts.map((cast: CastType) => (
          <Cast
            key={cast.hash}
            text={cast.text}
            timestamp={cast.timestamp}
            parent_url={cast.parent_url}
            reactions={cast.reactions}
            replies={cast.replies}
            embeds={cast.embeds}
            author={cast.author}
            // object={cast.object}
            hash={cast.hash}
            thread_hash={cast.thread_hash}
            parent_hash={cast.parent_hash}
            parent_author={cast.parent_author}
            mentioned_profiles={cast.mentioned_profiles}
            root_parent_url={cast.root_parent_url}
          />
        ))
      ) : (
        <p>oops</p>
      )}
    </div>
  )
}

export default CastFeed
