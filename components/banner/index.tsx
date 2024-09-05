"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface BannerProps {
  titleText: string
  descriptionText: string
}
export default function Banner({ titleText, descriptionText }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="animate-fade-in-down  inset-x-0 top-20 z-50">
      <div className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-0 flex-1 items-center">
              <span className="flex rounded-lg bg-primary-foreground p-2">
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
              </span>
              <p className="ml-3 truncate font-medium">
                <span className="md:hidden">{titleText}</span>
                <span className="hidden md:inline lg:text-base">
                  {descriptionText}
                </span>
              </p>
            </div>
            {/* <div className="order-3 mt-2 w-full shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
              <a
                href="#"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-primary-foreground"
              >
                Learn more
              </a>
            </div> */}
            <div className="order-2 shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                className="-mr-1 flex rounded-md p-2 hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                onClick={() => setIsVisible(false)}
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
