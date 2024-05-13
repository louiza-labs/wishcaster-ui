import React, { useEffect, useState } from "react"
import axios from "axios"

interface LinkPreviewProps {
  url: string
}

interface LinkMetadata {
  title: string
  description: string
  image: string
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(
          `https://api.microlink.io/?url=${encodeURIComponent(url)}`
        )
        const { data } = response.data
        setMetadata({
          title: data.title || "",
          description: data.description || "",
          image: data.image?.url || "",
        })
      } catch (error) {
        console.error("Error fetching metadata:", error)
      }
    }

    fetchMetadata()
  }, [url])

  if (!metadata) {
    return <div>Loading...</div>
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
      {metadata.image && (
        <img
          src={metadata.image}
          alt={metadata.title}
          className="h-auto w-full"
        />
      )}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">{metadata.title}</h3>
        <p className="mb-4 text-sm text-gray-700">{metadata.description}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-700"
        >
          Read more
        </a>
      </div>
    </div>
  )
}

export default LinkPreview
