"use server"

import * as natural from "natural"
import { eng } from "stopword"

// Pre-compile stop words list
const stopWordsList = new Set(eng)

export async function searchPostsWithKeywordV2(
  posts: any[],
  searchTerm: string
) {
  // Tokenize and stem search terms
  const tokenizer = new natural.WordTokenizer()
  const stemmer = natural.PorterStemmer
  const lowerCaseSearchTerm = searchTerm.toLowerCase()
  let searchWords = tokenizer
    .tokenize(lowerCaseSearchTerm)
    .map((word) => stemmer.stem(word))

  // Filter out stop words from the search words
  searchWords = searchWords.filter((word) => !stopWordsList.has(word))

  // Use a Set to track unique hashes and avoid duplicates
  const uniquePosts = new Set<string>()
  const filteredPosts: any[] = []

  for (const post of posts) {
    const postText = post.text.toLowerCase()

    // Tokenize and stem the post text
    const postWords = tokenizer
      .tokenize(postText)
      .map((word) => stemmer.stem(word))

    // Check if any of the search words match the post text
    let score = 0
    for (const word of searchWords) {
      if (postWords.includes(word)) {
        score++
      }
    }

    // Set a threshold for relevance
    const relevanceThreshold = 1
    if (score >= relevanceThreshold) {
      // Check for duplicate post using hash
      if (!uniquePosts.has(post.hash)) {
        uniquePosts.add(post.hash)
        filteredPosts.push(post)
      }
    }
  }

  return filteredPosts
}

export async function searchPostsWithKeywordsV2(
  posts: any[],
  searchTerms: string[]
) {
  // Tokenize and stem search terms
  const tokenizer = new natural.WordTokenizer()
  const stemmer = natural.PorterStemmer
  const uniquePosts = new Set<string>()
  const filteredPosts: any[] = []

  // Process each search term individually
  for (const searchTerm of searchTerms) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    let searchWords = tokenizer
      .tokenize(lowerCaseSearchTerm)
      .map((word) => stemmer.stem(word))

    // Filter out stop words from the search words
    searchWords = searchWords.filter((word) => !stopWordsList.has(word))

    for (const post of posts) {
      const postText = post.text.toLowerCase()

      // Tokenize and stem the post text
      const postWords = tokenizer
        .tokenize(postText)
        .map((word) => stemmer.stem(word))

      // Check if any of the search words match the post text
      let score = 0
      for (const word of searchWords) {
        if (postWords.includes(word)) {
          score++
        }
      }

      // Set a threshold for relevance
      const relevanceThreshold = 1
      if (score >= relevanceThreshold) {
        // Check for duplicate post using hash
        if (!uniquePosts.has(post.hash)) {
          uniquePosts.add(post.hash)
          filteredPosts.push(post)
        }
      }
    }
  }

  return filteredPosts
}
