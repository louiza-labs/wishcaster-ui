"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SuccessUIProps {
  result: any
  fields: any
}

const LinearSuccessUI = ({ result, fields }: SuccessUIProps) => {
  const name = fields.find((field: any) => field.id === "title").value
  const description = fields.find(
    (field: any) => field.id === "description"
  ).value
  const priority = fields.find((field: any) => field.id === "priority").value
  const url = result.url
  const projectId = fields.find((field: any) => field.id === "projectId").value

  const handleVisitLink = () => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  return (
    <Card className=" flex size-full flex-col gap-y-4 p-2">
      <p className="mt-2 pl-2 text-center text-sm font-semibold">
        {" "}
        Successfully created issue! 🥳{" "}
      </p>
      <Separator className={"w-full"} />
      <div className="flex flex-col items-start justify-between px-4">
        <CardContent className="flex flex-col items-start justify-between gap-y-2">
          {" "}
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="break-all text-sm text-muted-foreground">
            {description}
          </p>
          {projectId && projectId.length ? (
            <Badge className="mt-4">{projectId}</Badge>
          ) : null}
        </CardContent>
        <div className="flex w-full flex-col gap-y-2 pb-2">
          <Button className="w-full" onClick={handleVisitLink}>
            Visit
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default LinearSuccessUI
