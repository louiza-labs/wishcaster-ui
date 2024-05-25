import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"

interface HLSVideoPlayerProps {
  src: string
}

const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    let hls: Hls | undefined

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, options)

    if (video) {
      observer.observe(video)
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
      if (video) {
        video.pause()
        video.src = ""
        video.load()
        observer.unobserve(video)
      }
    }
  }, [src])

  useEffect(() => {
    const video = videoRef.current

    if (video && isVisible) {
      video.muted = isMuted
      video.play()
    } else if (video) {
      video.pause()
    }
  }, [isVisible, isMuted])

  return (
    <video ref={videoRef} controls style={{ width: "100%" }} muted={isMuted}>
      Your browser does not support HLS video.
    </video>
  )
}

export default HLSVideoPlayer
