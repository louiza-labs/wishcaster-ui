"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

interface BannerProps {
  titleText: string
  descriptionText: string
}
export default function Banner({ titleText, descriptionText }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const storedVisibility = localStorage.getItem(titleText)
    if (storedVisibility === "hidden") {
      setIsVisible(false)
    }
  }, [titleText])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(titleText, "hidden")
  }

  if (!isVisible) return null

  const renderCorrectIcon = () => {
    if (pathname.includes("/post")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-lightbulb size-6 text-primary"
        >
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      )
    } else if (pathname.includes("/topics") && !pathname.includes("/topics/")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
          className="lucide lucide-chart-bar-big size-6 text-primary"
        >
          <path d="M3 3v16a2 2 0 0 0 2 2h16" />
          <rect x="7" y="13" width="9" height="4" rx="1" />
          <rect x="7" y="5" width="12" height="4" rx="1" />
        </svg>
      )
    } else if (pathname.includes("/topic")) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-milestone size-6 text-primary"
        >
          <path d="M12 13v8" />
          <path d="M12 3v3" />
          <path d="M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z" />
        </svg>
      )
    } else if (
      pathname.includes("/research") &&
      !pathname.includes("/research/")
    ) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search size-6 text-primary"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      )
    } else
      return (
        <svg
          className="size-6 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      )
  }

  return (
    <div className="animate-fade-in-down inset-x-0 top-20 z-50">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-primary-foreground p-2">
                {renderCorrectIcon()}
              </span>
              <p className="ml-3 truncate font-medium">
                <span className="md:hidden">{titleText}</span>
                <span className="hidden md:inline lg:text-base">
                  {descriptionText}
                </span>
              </p>
            </div>
            <div className="order-2 shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                className="-mr-1 flex rounded-md p-2 hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
                <X
                  className="size-6 text-primary-foreground"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
