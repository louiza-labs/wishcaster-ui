"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function InteractionsCheckbox({ id, text, handleChange, value }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox onCheckedChange={handleChange} checked={value} id={id} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {text}
      </label>
    </div>
  )
}
