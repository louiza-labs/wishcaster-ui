import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DateFilterProps {
  value: string
  datesArray: any[]
}

const DateFilter = ({ value, datesArray }: DateFilterProps) => {
  return (
    <div className="flex flex-row items-center md:gap-x-1">
      {datesArray.map((dateVal, index: number) => (
        <>
          <Button
            variant={"ghost"}
            onClick={dateVal.handleChange}
            key={dateVal.value}
          >
            <p
              className={cn(
                value === dateVal.value ? "font-bold" : "font-light",
                "text-xs md:text-sm "
              )}
            >
              {dateVal.label}
            </p>
          </Button>
          <span
            className={cn(
              index === datesArray.length - 1
                ? "hidden"
                : "text-xs font-light md:text-sm"
            )}
          >
            /
          </span>
        </>
      ))}
    </div>
  )
}

export default DateFilter
