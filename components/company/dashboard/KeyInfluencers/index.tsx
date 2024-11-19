import { Users } from "lucide-react"

import { relevantUsers } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function KeyInfluencersTab() {
  return (
    <>
      {relevantUsers.map((user) => (
        <Card key={user.id} className="mb-4 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Avatar className="size-12">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.handle}</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant={
                            user.sentiment === "positive"
                              ? "success"
                              : user.sentiment === "neutral"
                              ? "secondary"
                              : "warning"
                          }
                        >
                          {user.sentiment}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>User sentiment towards our brand</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="mt-1 text-sm text-slate-700">{user.bio}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="mr-1 size-4" />
                    <span>{user.followers.toLocaleString()} followers</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/engage-influencer/${user.id}`)
                    }
                  >
                    Engage with Influencer
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
