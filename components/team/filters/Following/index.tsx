import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface FollowingFilterProps {
  disabled: boolean
  checked: boolean
  onChange: (val: boolean) => void
}

const FollowingFilter = ({
  disabled,
  checked,
  onChange,
}: FollowingFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
        id="following-filter"
      />
      <Label className="font-bold" htmlFor="following-filter">
        Following
      </Label>
    </div>
  )
}

export default FollowingFilter
