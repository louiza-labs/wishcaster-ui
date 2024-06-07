import { Cast as CastType } from "@/types"

import { apiUrl } from "@/lib/constants"

export async function fetchTaglines(casts: CastType[]) {
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
  } catch (e) {}
}
