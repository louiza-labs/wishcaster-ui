import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

import { PRODUCT_CATEGORIES } from "@/lib/constants"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const prompt = `Based on the following product categories: ${PRODUCT_CATEGORIES}, categorize each product request into the category that fits it best. Ensure that each request is categorized and done so effectively. Please include in the response for each categorization both the Product Request and categorization. The product requests to categorize for are as follows: ${messages
      .map((message: any, i: number) => `Request ${i + 1}:\n${message.text}`)
      .join("\n\n")}
      
      For example, if a request is about 'AMA Frames' it should be categorized under the 'Frames' category. Please follow similar guidelines for all requests.
      `
    const result = await generateObject({
      model: openai("gpt-3.5-turbo"),
      prompt,
      // maxTokens: 600,
      schema: z.object({
        categorizedRequests: z.array(
          z.object({
            request: z.string(),
            category: z.string(),
          })
        ),
      }),
    })
    return Response.json(result.object.categorizedRequests)
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process request", message: error }),
      { status: 500 }
    )
  }
}
