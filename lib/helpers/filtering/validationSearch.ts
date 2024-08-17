"use server"

import nlp from "compromise"

const stopWords = new Set([
  "the",
  "is",
  "in",
  "and",
  "to",
  "a",
  "for",
  "of",
  "on",
  "with",
])

function tokenizeAndClean(text: string): string[] {
  const doc = nlp(
    text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim()
  )
  return doc
    .terms()
    .out("array")
    .filter((word: any) => !stopWords.has(word) && word.length > 1)
}

class TfIdf {
  private documents: string[] = []
  private termFreqs: Record<string, Record<string, number>> = {}
  private docFreqs: Record<string, number> = {}
  private docCount: number = 0

  addDocument(doc: string): void {
    this.docCount++
    const terms = tokenizeAndClean(doc)
    this.documents.push(doc)
    const termCounts: Record<string, number> = {}
    terms.forEach((term) => {
      termCounts[term] = (termCounts[term] || 0) + 1
      this.docFreqs[term] = (this.docFreqs[term] || 0) + 1
    })
    this.termFreqs[doc] = termCounts
  }

  listTerms(docIndex: number): { term: string; tfidf: number }[] {
    const doc = this.documents[docIndex]
    const termCounts = this.termFreqs[doc]
    const totalTerms = Object.keys(termCounts).reduce(
      (sum, term) => sum + termCounts[term],
      0
    )
    return Object.keys(termCounts).map((term) => {
      const tf = termCounts[term] / totalTerms
      const idf = Math.log(this.docCount / (this.docFreqs[term] || 1))
      return { term, tfidf: tf * idf }
    })
  }
}

function vectorize(
  tfIdfData: Record<string, number>,
  terms: string[]
): number[] {
  return terms.map((term) => tfIdfData[term] || 0)
}

function calculateCosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

function keywordMatchScore(text: string, keywords: string[]): number {
  const textTerms = tokenizeAndClean(text)
  return keywords.reduce((score, keyword) => {
    const keywordCount = textTerms.filter((term) => term === keyword).length
    return score + keywordCount
  }, 0)
}

// export function findMostRelevantPosts(
//   posts: any[],
//   searchTerm: string,
//   topN: number
// ): any[] {
//   const queryTerms = tokenizeAndClean(searchTerm)

//   const tfidf = new TfIdf()
//   posts.forEach((post) => tfidf.addDocument(post.text))

//   const queryVector = vectorize(
//     tfidf.listTerms(0).reduce((acc, term) => {
//       acc[term.term] = term.tfidf
//       return acc
//     }, {} as Record<string, number>),
//     queryTerms
//   )

//   const scores = posts.map((post, i) => {
//     const postVector = vectorize(
//       tfidf.listTerms(i).reduce((acc, term) => {
//         acc[term.term] = term.tfidf
//         return acc
//       }, {} as Record<string, number>),
//       queryTerms
//     )

//     const cosineScore = calculateCosineSimilarity(queryVector, postVector)
//     const keywordScore = keywordMatchScore(post.text, queryTerms)

//     return {
//       post,
//       score: cosineScore + keywordScore, // Combine TF-IDF score with keyword matching score
//     }
//   })

//   scores.sort((a, b) => b.score - a.score)
//   return scores.slice(0, topN).map((item) => item.post)
// }

// export function searchPostsWithKeywords(
//   posts: any[],
//   searchTerm: string
// ): any[] {
//   // Ensure searchTerm is lowercase for case-insensitive comparison
//   const lowerCaseSearchTerm = searchTerm.toLowerCase()

//   // Split the search term into individual words
//   let searchWords = lowerCaseSearchTerm.split(/\s+/).filter(Boolean)

//   // Define a set of common stop words to ignore
//   const stopWords = new Set([
//     "for",
//     "is",
//     "in",
//     "at",
//     "of",
//     "the",
//     "and",
//     "to",
//     "a",
//     "an",
//     "on",
//     "with",
//   ])

//   // Filter out the stop words from the search words
//   searchWords = searchWords.filter((word) => !stopWords.has(word))

//   // Use a Set to track unique hashes and avoid duplicates
//   const uniquePosts = new Set<string>()
//   const filteredPosts: any[] = []

//   for (const post of posts) {
//     const postText = post.text.toLowerCase()

//     // Check if any of the search words match the post text
//     const textMatch = searchWords.some((word) => postText.includes(word))

//     if (textMatch) {
//       // Check for duplicate post using hash
//       if (!uniquePosts.has(post.hash)) {
//         uniquePosts.add(post.hash)
//         filteredPosts.push(post)
//       }
//     }
//   }

//   return filteredPosts
// }
