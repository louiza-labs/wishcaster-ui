import { Cast as CastType } from "@/types"

import { apiUrl } from "@/lib/constants"

export async function fetchTaglines(casts: CastType[]) {
  console.log("the api url", `${apiUrl}/summarize`)
  console.log("the vercel url", process.env.VERCEL_URL)
  console.log("the vercel PUBLIC url", process.env.NEXT_PUBLIC_VERCEL_URL)

  try {
    const response = await fetch(`${apiUrl}/summarize`, {
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
    })

    return response.json()
  } catch (e) {
    return []
  }
}
