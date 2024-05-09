import { Cast as CastType } from "@/types"

import CastFeed from "@/components/feed/Casts"
import { fetchChannelCasts } from "@/app/actions"

export default async function IndexPage() {
  const casts = (await fetchChannelCasts("someone-build")) as CastType[]

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          What people want! <br className="hidden sm:inline" />
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg">
          Sourced directly from Farcaster&apos;s{" "}
          <span className="font-bold">someone-build channel</span>
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {/* <Categories casts={casts} /> */}
        <CastFeed casts={casts} />
      </div>
    </section>
  )
}
