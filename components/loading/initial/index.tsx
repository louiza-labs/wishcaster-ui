"use client"

import { useEffect, useState } from "react"
import { Lightbulb, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

import { Icons } from "@/components/icons"

const tasks = [
  "Initializing application...",
  "Loading social posts...",
  "Preparing UI...",
  "Optimizing performance...",
  "Almost there...",
]

const funFacts = [
  "The first computer bug was an actual real-life bug.",
  "The first computer mouse was made of wood.",
  "The first domain name ever registered was Symbolics.com.",
  "The QWERTY keyboard was designed to slow typing.",
  "The first 1GB hard disk drive was as big as a refrigerator.",
]

export default function Component() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const { theme } = useTheme()

  useEffect(() => {
    const taskInterval = setInterval(() => {
      setCurrentTaskIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % tasks.length
        setProgress((newIndex / (tasks.length - 1)) * 100)
        return newIndex
      })
    }, 2000)

    const factInterval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length)
    }, 4000)

    return () => {
      clearInterval(taskInterval)
      clearInterval(factInterval)
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 transition-colors duration-200 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg transition-colors duration-200 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-between">
          <Icons.logo />
        </div>
        <div className="flex items-center space-x-3">
          <Loader2 className="size-5 animate-spin text-blue-600 dark:text-blue-400" />
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
            {tasks[currentTaskIndex]}
          </p>
        </div>
        <div className="relative pt-1">
          <div className="flex h-2 overflow-hidden rounded bg-blue-200 text-xs dark:bg-blue-900">
            <div
              style={{ width: `${progress}%` }}
              className="flex flex-col justify-center whitespace-nowrap bg-blue-600 text-center text-white shadow-none transition-all duration-500 ease-out dark:bg-blue-400"
            ></div>
          </div>
        </div>
        <div className="flex items-start space-x-3 text-sm">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-yellow-500" />
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Did you know:</span>{" "}
            {funFacts[currentFactIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}
