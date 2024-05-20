"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface IntereractionsCheckboxProps {
  id: string
  text: string
  handleChange: () => void
  value: boolean
  isDisabled?: boolean
}

export function InteractionsCheckbox({
  id,
  text,
  handleChange,
  value,
  isDisabled,
}: IntereractionsCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        disabled={isDisabled}
        onCheckedChange={handleChange}
        checked={value}
        id={id}
      />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {text}
      </label>
    </div>
  )
}
