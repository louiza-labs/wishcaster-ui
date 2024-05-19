import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface FollowingUserSwitchProps {
  handleSwitchChange: (val: boolean) => void
  value: boolean
  hasConnectedAccount: boolean
}
export function FollowingUserSwitch({
  handleSwitchChange,
  value,
  hasConnectedAccount,
}: FollowingUserSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={!hasConnectedAccount}
        checked={value}
        onCheckedChange={handleSwitchChange}
        id="following"
      />
      <Label htmlFor="following">Followed Users</Label>
    </div>
  )
}
