// "use client"

import { useEffect, useState } from "react"
import axios from "axios"

const useGetCategories = (casts: any) => {
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const source = axios.CancelToken.source() // Create a cancel token source
    const getCategoriesFromCasts = async () => {
      try {
        const response = await axios.post(
          "/api/categorize",
          {
            messages: casts,
          },
          {
            // cancelToken: source.token, // Pass the cancel token to the request
          }
        )
        console.log("the response", response.data)
        setCategories(response.data)
      } catch (e) {
        if (axios.isCancel(e)) {
          console.log("Request canceled", e.message)
        } else {
          console.error(e)
          setError("Failed to fetch categories")
        }
      }
    }

    if (casts.length > 0) {
      getCategoriesFromCasts()
    }

    return () => {
      source.cancel("Component unmounted: Operation canceled by the user.") // Cleanup function that cancels the request
    }
  }, [casts]) // Ensure this only re-runs if `casts` changes

  return {
    categories,
    error,
  }
}

export default useGetCategories
