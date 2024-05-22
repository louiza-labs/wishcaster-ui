"use client"

import { useEffect, useRef } from "react"
import Hls from "hls.js"

interface HLSVideoPlayerProps {
  src: string
}

const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    let hls: Hls | undefined

    if (video) {
      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play()
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native support for HLS (like Safari)
        video.src = src
        video.addEventListener("loadedmetadata", () => {
          video.play()
        })
      }
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
      if (video) {
        video.pause()
        video.src = ""
        video.load() // This is necessary to ensure the video stops downloading
      }
    }
  }, [src])

  return (
    <video ref={videoRef} controls style={{ width: "100%" }}>
      Your browser does not support HLS video.
    </video>
  )
}

export default HLSVideoPlayer
