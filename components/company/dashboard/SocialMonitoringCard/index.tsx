import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KeyInfluencersTab } from "@/components/company/dashboard/KeyInfluencers"
import { TopPostsTab } from "@/components/company/dashboard/TopPostsTab"

export function SocialMonitoringCard() {
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <Card className="mb-8 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-slate-800">
          What Social Posts Should We Be Monitoring?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="posts">Top Posts</TabsTrigger>
            <TabsTrigger value="users">Key Influencers</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <ScrollArea className="h-[400px] pr-4">
              <TopPostsTab />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="users">
            <ScrollArea className="h-[400px] pr-4">
              <KeyInfluencersTab />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
