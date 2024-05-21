import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SortGroupProps {
  arrayOfSortByValueObjects: any[]
  handleChange: any
  value: string
}

export function SortGroup({
  arrayOfSortByValueObjects,
  handleChange,
  value,
}: SortGroupProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={handleChange}
      orientation="horizontal"
      className="flex w-full flex-row items-center justify-around md:justify-start"
    >
      {arrayOfSortByValueObjects && arrayOfSortByValueObjects.length
        ? arrayOfSortByValueObjects.map((sortByObject) => (
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={sortByObject.value}
                id={sortByObject.value}
                key={sortByObject.value}
              />
              <Label htmlFor={sortByObject.value}>{sortByObject.label}</Label>
            </div>
          ))
        : null}
    </RadioGroup>
  )
}
