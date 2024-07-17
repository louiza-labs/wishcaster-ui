import { NeynarAPIClient } from "@neynar/nodejs-sdk"

import { fetchCastsUntilCovered } from "@/app/actions"

export async function GET() {
  const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string)

  // first fetch all the casts from neynar
  const {} = fetchCastsUntilCovered("someone-build", "ytd")
  // then fetch all the casts from the db
  // create an array of casts that don't overlap
  // upload that array of casts to the db

  // Next steps - compare any existing casts that vary on their engagement stats between db and neynar and use a bulk update for those casts

  const result = await fetch(
    "http://worldtimeapi.org/api/timezone/America/Chicago",
    {
      cache: "no-store",
    }
  )
  const data = await result.json()

  return Response.json({ datetime: data.datetime })
}
