"use server"

import { Cast } from "@/types"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// import { google } from "googleapis"
import { PRODUCT_CATEGORIES } from "@/lib/constants"

export const categorizeCastsAsRequests = async (casts: Cast[]) => {
  try {
    const prompt = `Based on the following product categories: ${PRODUCT_CATEGORIES}, categorize each product request into the category that fits it best. Ensure that each request is categorized and done so effectively. Please include in the response for each categorization both the Product Request and categorization. For each product request, you are to only provide a single category, that is the one of the best fit. The product requests to categorize for are as follows: ${casts
      .map((message: any, i: number) => `Request ${i + 1}:\n${message.text}`)
      .join("\n\n")}
      
      Here are some examples to follow:
       1. if a request is about 'AMA Frames', it should be categorized under the 'Frames' category. 
       2. if a request is about 'browser extensions', it should be categorized under the 'Extensions' category.
       3. if a request is about 'grant programs', it should be categorized under the 'Grants' category
       4. if a request is about 'Swaps', it should be categorized under the 'DeFi' category
       5. if a request is about 'Staking or Lending', it should be categorized under the 'DeFi' category
       6. if a request is about 'Clients', it should be categorized under the clients category
       
      
       Please follow similar guidelines for all requests.
      `
    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      maxRetries: 4,
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
    return result.object.categorizedRequests
  } catch (error) {
    console.log(error)
    return casts
  }
}

export const generateTaglinesForCasts = async (casts: Cast[]) => {
  try {
    const prompt = `Summarize each product request into a concise 4-word tagline. These taglines are meant to clearly and briefly describe what product or feature someone wants. Please return back the generated tagline and corresponding hash. There may be links or backslashed text (ex: /someone-build) or mentions (@joe), please ignore that and focus solely on the product being requested. The product requests are as follows:\n\n${casts
      .map(
        ({ text, hash }, index) => `Request ${index}:\n${text}\nHash: ${hash}`
      )
      .join("\n\n")}`

    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      maxRetries: 3,
      temperature: 0.3,
      maxTokens: 1000, // Adjusted to limit the output to shorter responses
      schema: z.object({
        taglines: z.array(
          z.object({
            tagline: z.string(),
            hash: z.string(),
          })
        ), // Expecting an array of objects with text and hash fields
      }),
    })

    return result.object.taglines
  } catch (error) {
    console.log("Error in generating taglines:", error)

    if (error instanceof SyntaxError) {
      console.log("Received malformed JSON:", error.text)
    }
    return []
  }
}
