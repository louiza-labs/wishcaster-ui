import { CastSkeleton } from "@/components/loading/cast"

interface CastsFeedLoadingSkeletonProps {
  count: number
}
const CastsFeedLoadingSkeleton = ({ count }: CastsFeedLoadingSkeletonProps) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      {Array.from({ length: count }, (_, index) => (
        <CastSkeleton key={index} />
      ))}
    </div>
  )
}

export default CastsFeedLoadingSkeleton
