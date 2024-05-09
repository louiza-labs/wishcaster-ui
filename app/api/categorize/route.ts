import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const prompt = `Generate concise product categories for an online product idea discovery site based on the following product requests. Ensure that each category should be broad enough to avoid overlap and encompass multiple requests. Use a maximum of 3 words for each category. Only send back the categories. Nothing else should be included in the response. Here are 3 examples of a good category: Example 1: Farcaster Client. Example 2: Developer API. Example 3: Music creation tools. Please use conventional categories. The product requests to generate categories for are as follows: ${messages
      .map((message: any, i: number) => `Request ${i + 1}:\n${message.text}`)
      .join("\n\n")}`
    const result = await streamObject({
      model: openai("gpt-4"),
      prompt,
      maxTokens: 600,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 1,
      presencePenalty: 0,
      schema: z.object({
        name: z.string(),
        class: z.string().describe("Product Category"),
        description: z.string(),
      }),
    })
    const categoriesArray = []
    for await (const partialObject of result.partialObjectStream) {
      categoriesArray.push(partialObject)
    }
    return Response.json(categoriesArray)
  } catch (error) {
    return Response.json(error)
  }
}
