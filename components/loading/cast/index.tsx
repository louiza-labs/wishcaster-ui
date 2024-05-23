import { Skeleton } from "@/components/ui/skeleton"

const CastReactionSkeleton = () => {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex flex-col items-start gap-y-1">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  )
}

export function CastSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-row items-start justify-between gap-x-2">
        <div className="flex flex-row gap-x-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-4 w-24 rounded-sm " />
          </div>
        </div>
        <Skeleton className="size-6 h-10 w-28 rounded-xl " />
      </div>
      <Skeleton className="my-4 size-6 h-24 w-full rounded-xl " />

      <div className="space-y flex w-full flex-row justify-around">
        <CastReactionSkeleton />
        <CastReactionSkeleton />
        <CastReactionSkeleton />
      </div>
      <Skeleton className="mt-6 h-6 w-40 rounded-xl " />
    </div>
  )
}
