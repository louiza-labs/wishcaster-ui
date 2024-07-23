interface taglinesWithHashesArr {
  hash: string
  tagline: string
}
export const addTaglinesToCasts = (
  casts: any[],
  taglinesWithHashes: taglinesWithHashesArr[]
) => {
  const taglineHashDict = taglinesWithHashes.reduce((dict: any, tagHash) => {
    dict[tagHash.hash] = tagHash.tagline
    return dict
  }, {})
  return casts.map((cast) => {
    if (!cast.hash) return cast
    let taglineForCast = taglineHashDict[cast.hash]
    return {
      ...cast,
      tagline: taglineForCast,
    }
  })
}
