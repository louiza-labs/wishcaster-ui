import { Cast as CastType } from "@/types"

export async function fetchTaglines(casts: CastType[]) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/summarize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: casts.map((cast) => ({
          text: cast.text,
          hash: cast.hash,
        })),
      }),
    }
  )
  if (!response.ok) {
    throw new Error("Failed to fetch taglines")
  }
  return response.json()
}
