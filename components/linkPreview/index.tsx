import React, { useEffect, useState } from "react"
import axios from "axios"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

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
        // console.error("Error fetching metadata:", error)
      }
    }

    fetchMetadata()
  }, [url])

  if (!metadata) {
    return <div>Loading...</div>
  }

  return (
    <Card className=" relative flex w-fit flex-col justify-between lg:h-fit">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <CardHeader>
          {metadata.image && (
            <img
              src={metadata.image}
              alt={metadata.title}
              className="h-auto w-fit"
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="p-2">
            <h3 className="mb-2 text-lg font-semibold">{metadata.title}</h3>
            <p className=" text-sm ">{metadata.description}</p>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </a>
    </Card>
  )
}

export default LinkPreview
