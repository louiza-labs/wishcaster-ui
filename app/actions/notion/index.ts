"use server"

const { Client } = require("@notionhq/client")

export async function searchNotion(accessToken: string) {
  const notion = new Client({ auth: accessToken })

  try {
    const response = await notion.search({
      query: undefined,
      // filter: {
      //   value: "page",
      //   property: "object",
      // },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    })
    const { results, next_cursor } = response
    return { results, next_cursor }
  } catch (e) {
    return { results: [], next_cursor: "" }
  }
}

export async function getNotionPage() {}

export async function createNotionDatabase(databaseInfo: any) {}

export async function createNotionItem(
  accessToken: string,
  type: "page" | "database",
  parentId: string,
  properties: any,
  wcLinkForCast: string
) {
  const notion = new Client({ auth: accessToken })
  const { title, description } = properties

  try {
    const response = await notion.pages.create({
      parent: {
        type: type === "page" ? "page_id" : "database_id",

        page_id: type === "page" ? parentId : undefined,
        database_id: type === "page" ? undefined : parentId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Saved Cast from WishCaster",
                },
              },
            ],
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: description,
                },
              },
            ],
            color: "default",
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: wcLinkForCast,
                  link: {
                    url: wcLinkForCast,
                  },
                },
                href: wcLinkForCast,
              },
            ],
            color: "default",
          },
        },
      ],
    })
    if (response) {
      const { url } = response
      return { url }
    }
  } catch (e) {
    console.error("error creating a page", e)
  }
}
