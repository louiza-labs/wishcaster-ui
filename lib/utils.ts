import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateStartDate = (
  range: "24-hours" | "7-days" | "30-days" | "ytd"
): Date => {
  const now = new Date()
  switch (range) {
    case "24-hours":
      now.setDate(now.getDate() - 1)
      break
    case "7-days":
      now.setDate(now.getDate() - 7)
      break
    case "30-days":
      now.setDate(now.getDate() - 30)
      break
    case "ytd":
      now.setMonth(0, 1) // Start from January 1st of the current year
      break
  }
  return now
}

export const formatDateForCastTimestamp = (timestamp: string) => {
  const now = new Date()
  const postDate = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInMonths / 12)

  const formatTime = (value: number, unit: string) => {
    return `${value} ${unit}${value !== 1 ? "s" : ""} ago`
  }

  if (diffInYears > 0) return formatTime(diffInYears, "year")
  if (diffInMonths > 0) return formatTime(diffInMonths, "month")
  if (diffInWeeks > 0) return formatTime(diffInWeeks, "week")
  if (diffInDays > 0) return formatTime(diffInDays, "day")
  if (diffInHours > 0) return formatTime(diffInHours, "hour")
  if (diffInMinutes > 0) return formatTime(diffInMinutes, "minute")
  return "Just now"
}

export const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timer)
    //@ts-ignore
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}

export const removeSearchParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname)
}
