import googleTrends from "google-trends-api"

export async function fetchGoogleTrendsInfo(searchTerm: string) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const result = googleTrends
    .interestOverTime({ keyword: "Valentines Day" })
    .then((res) => {
      console.log("this is res", res)
      return res
    })
    .catch((err) => {
      console.log("got the error", err)
      console.log("error message", err.message)
      console.log("request body", err.requestBody)
    })

  return result
}
