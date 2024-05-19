import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface BadgeSwitchProps {
  handleSwitchChange: (val: boolean) => void
  value: boolean
}
export function PriorityBadgeSwitch({
  handleSwitchChange,
  value,
}: BadgeSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={value}
        onCheckedChange={handleSwitchChange}
        id="priority-badge"
      />
      <Label htmlFor="priority-badge">Power Badges</Label>
    </div>
  )
}
