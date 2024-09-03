import { NormalizedPostType } from "@/types"

export function sortPostsByProperty(
  posts: NormalizedPostType[],
  sortField: "recent" | "commentsCount" | "likesCount" | "sharesCount" | string
): NormalizedPostType[] {
  // Create a shallow copy of the array to sort, to avoid modifying the original array
  const sortedPosts = [...posts]

  // Sort the copied array
  sortedPosts.sort((a: any, b: any) => {
    let valueA: number | string
    let valueB: number | string

    switch (sortField) {
      case "recent":
        // Sort by timestamp in descending order
        valueA = new Date(a.createdAt).getTime()
        valueB = new Date(b.createdAt).getTime()
        break
      case "commentsCount":
        // Sort by comments count
        valueA = a.commentsCount || 0
        valueB = b.commentsCount || 0
        break
      case "likesCount":
        valueA = a.likesCount || 0
        valueB = b.likesCount || 0
        break
      case "sharesCount":
        valueA = a.sharesCount || 0
        valueB = b.sharesCount || 0
        break
      default:
        // If the sortField is any other custom metric, use additionalMetrics or reactions
        let metricA = a.additionalMetrics ? a.additionalMetrics[sortField] : 0
        let metricB = b.additionalMetrics ? b.additionalMetrics[sortField] : 0

        // Fallback to reactions if additionalMetrics does not cover the sortField
        if (!metricA && a.reactions) {
          metricA = a.reactions[sortField] || 0
        }
        if (!metricB && b.reactions) {
          metricB = b.reactions[sortField] || 0
        }

        valueA = metricA
        valueB = metricB
        break
    }

    // Return negative, zero, or positive based on the comparison for descending order
    return Number(valueB) - Number(valueA)
  })

  return sortedPosts
}
