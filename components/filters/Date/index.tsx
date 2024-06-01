import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateFilterProps {
  value: string
  datesArray: any[]
  asFilterBar?: boolean
  handleChangeForSelect?: (val: string) => void
}

const DateFilter = ({
  value,
  datesArray,
  asFilterBar,
  handleChangeForSelect,
}: DateFilterProps) => {
  return (
    <>
      {asFilterBar ? (
        <Select onValueChange={handleChangeForSelect}>
          <SelectTrigger className="gap-x-2 rounded-full px-2 text-sm font-medium">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            {datesArray.map((dateVal) => {
              if (dateVal) {
                return (
                  <SelectItem value={dateVal.value} key={dateVal.label}>
                    {dateVal.label}
                  </SelectItem>
                )
              }
            })}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex flex-row items-center md:flex-wrap md:gap-x-1">
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
      )}
    </>
  )
}

export default DateFilter
