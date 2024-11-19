import { topPosts } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TopPostsTab() {
  return (
    <>
      {topPosts.map((post, index) => (
        <Card key={post.id} className="mb-4 bg-slate-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">#{index + 1} Most Engaging</Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={
                        post.sentiment === "positive"
                          ? "default"
                          : post.sentiment === "neutral"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {post.sentiment}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Post sentiment</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-slate-800">{post.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">
                {post.engagement} engagements
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (window.location.href = `/respond-to-post/${post.id}`)
                }
              >
                Respond to Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
