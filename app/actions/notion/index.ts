const { Client } = require("@notionhq/client")

export async function searchNotion(
  searchTerm: string | undefined,
  accessToken: string
) {
  const notion = new Client({ auth: accessToken })

  try {
    const response = await notion.search({
      query: undefined,
      filter: {
        value: "page",
        property: "object",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    })
    console.log("the notion search res", response)
  } catch (e) {
    console.log("the error for notion", e)
  }
}

export async function getNotionPage() {}

export async function createNotionDatabase(databaseInfo: any) {}

export async function createNotionPage(pageContent: any) {}
