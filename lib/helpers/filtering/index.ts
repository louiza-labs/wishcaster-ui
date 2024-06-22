import { Cast as CastType, Category } from "@/types"

export const filterDuplicateCategory = (categories: Category[]) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
}
export const filterDuplicateCategories = (categories: Category[]) => {
  if (
    !categories ||
    (Array.isArray(categories) && !categories.length) ||
    !Array.isArray(categories)
  ) {
    return []
  }
  const uniqueCategories = categories.filter(
    (category, index, self) =>
      index === self.findIndex((c) => c.category.id === category.category.id)
  )
  return uniqueCategories.filter((category: Category) => category.category.id)
}

export const searchCastsForTerm = (
  casts: CastType[],
  searchTerm: string
): CastType[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim()
  return casts.filter((cast) =>
    cast.text.toLowerCase().includes(lowerCaseSearchTerm)
  )
}

export const filterReactionsByChannel = (reactions: any, channelId: string) => {
  if (reactions && reactions.length) {
    return reactions.filter(
      (reaction: any) => reaction.channel && reaction.channel.id === channelId
    )
  }
  return reactions
}
