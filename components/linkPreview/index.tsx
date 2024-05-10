import React from "react"
import { getLinkPreview } from "react-link-preview"

const LinkCard = ({ url }) => {
  const [previewData, setPreviewData] = React.useState(null)

  React.useEffect(() => {
    const fetchLinkPreview = async () => {
      try {
        const data = await getLinkPreview(url)
        setPreviewData(data)
      } catch (error) {
        console.error("Error fetching link preview:", error)
      }
    }

    fetchLinkPreview()
  }, [url])

  return (
    <div className="link-card">
      {previewData && (
        <div className="card-content">
          <img src={previewData.images[0]} alt={previewData.title} />
          <div className="card-text">
            <h3>{previewData.title}</h3>
            <p>{previewData.description}</p>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Go to link
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkCard
