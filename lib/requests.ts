import { Cast as CastType } from "@/types"

export async function fetchTaglines(casts: CastType[]) {
  try {
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

    return response.json()
  } catch (e) {}
}
