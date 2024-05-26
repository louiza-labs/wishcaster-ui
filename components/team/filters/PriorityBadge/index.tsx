import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface PowerBadgeFilterProps {
  disabled: boolean
  checked: boolean
  onChange: (val: boolean) => void
}

const PowerBadgeFilter = ({
  disabled,
  checked,
  onChange,
}: PowerBadgeFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
        id="power-badge"
      />
      <Label className="font-bold" htmlFor="power-badge">
        Power Badge
      </Label>
    </div>
  )
}

export default PowerBadgeFilter
