import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface SuccessUIProps {
  result: any
  fields: any
}

const NotionSuccessUI = ({ result, fields }: SuccessUIProps) => {
  const name = fields.find((field: any) => field.id === "title").value
  const description = fields.find(
    (field: any) => field.id === "description"
  ).value

  const pages = fields.find((field: any) => field.id === "parentPage").options
  const page = fields.find((field: any) => field.id === "parentPage").value
  const pageName =
    pages && pages.length
      ? pages.find((pageObj: any) => pageObj.value === page).name
      : ""
  const url = result.url

  const handleVisitLink = () => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank")
    }
  }

  return (
    <Card className=" flex size-full flex-col gap-y-4 p-2">
      <p className="-mb-2 text-center text-sm font-medium">
        {" "}
        New Notion Page Summary 🥳{" "}
      </p>
      <Separator className={"w-full"} />

      <div className="flex h-full flex-col items-start justify-between ">
        <CardContent className="flex flex-col items-start justify-between gap-y-2">
          {" "}
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="break-all text-sm text-muted-foreground">
            {description}
          </p>
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

export default NotionSuccessUI
