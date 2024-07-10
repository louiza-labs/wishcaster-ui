import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface GithubSuccessUIProps {
  result: any
  fields: any
}

const GithubSuccessUI = ({ result, fields }: GithubSuccessUIProps) => {
  const name = fields.find((field: any) => field.id === "title").value
  const description = fields.find(
    (field: any) => field.id === "description"
  ).value
  const isPrivate = fields.find((field: any) => field.id === "private").value
  const url = result.html_url

  const handleVisitRepo = () => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  return (
    <Card className="grid w-full max-w-md gap-6 p-6">
      <CardHeader>
        <p className="font-medium"> Your new Repo 🥳 </p>
      </CardHeader>
      <div className="flex flex-row items-center justify-between">
        <CardContent className="flex flex-col items-start justify-between">
          {" "}
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-muted-foreground">{description}</p>
          <Badge className="mt-4 w-fit">
            {isPrivate ? "Private" : "Public"}{" "}
          </Badge>
        </CardContent>
        <div className="flex flex-col gap-y-2">
          <Button className="w-full" onClick={handleVisitRepo}>
            Visit
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default GithubSuccessUI
