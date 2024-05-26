import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface FollowerFilterProps {
  disabled: boolean
  checked: boolean
  onChange: (val: boolean) => void
}

const FollowerFilter = ({
  disabled,
  checked,
  onChange,
}: FollowerFilterProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={disabled}
        checked={checked}
        onCheckedChange={onChange}
        id="follower-filter"
      />
      <Label className="font-bold" htmlFor="follower-filter">
        Follower
      </Label>
    </div>
  )
}

export default FollowerFilter
