import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const prompt = `Summarize each product request into a concise 4-word tagline. These taglines are meant to clearly and briefly describe what product or feature someone wants. Please return back the generated tagline and corresponding hash. There may be links or backslashed text (ex: /someone-build) or mentions (@joe), please ignore that and focus solely on the product being requested. The product requests are as follows:\n\n${messages
      .map(
        (
          {
            text,
            hash,
          }: {
            text: string
            hash: string
          },
          index: number
        ) => `Request ${index}:\n${text}\nHash: ${hash}`
      )
      .join("\n\n")}`

    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      prompt,
      maxRetries: 3,
      maxTokens: 800, // Adjusted to limit the output to shorter responses
      schema: z.object({
        taglines: z.array(
          z.object({
            hash: z.string(),
            tagline: z.string(),
          })
        ), // Expecting an array of objects with text and hash fields
      }),
    })
    return Response.json(result.object.taglines)
  } catch (error) {
    console.error("err with summarizing", error)
    return new Response(
      JSON.stringify({ error: "Failed to process request", message: error }),
      { status: 500 }
    )
  }
}
