import { summarizeByCategory } from "@/lib/helpers"
import { DataTable } from "@/components/ui/data-table"
import { generateColumns } from "@/components/ui/data-table/columns"

interface Column {
  accessorKey: string
  title: string
  fixed?: boolean
}
interface ProblemsTableProps {
  problemsData: any[]
  mobileView: string | undefined
  handleRowClick: (val: string) => void
}
const ProblemsTable = ({
  problemsData,
  handleRowClick,
  mobileView,
}: ProblemsTableProps) => {
  const columnsConfig: Column[] = [
    // { accessorKey: "id", title: "Hash" },
    {
      accessorKey: "problem",
      title: "Problem",
    },
    { accessorKey: "count", title: "Count" },

    { accessorKey: "likes", title: "Likes" },
    // { accessorKey: "priority-likes", title: "Priority Likes" },
    { accessorKey: "recasts", title: "Recasts" },
    { accessorKey: "replies", title: "Replies" },
    // { accessorKey: "averageFollowerCount", title: "Avg. Followers" },
    // { accessorKey: "powerBadgeCount", title: "Power Badges" },
  ]

  const columns = generateColumns(columnsConfig)
  const formattedData = summarizeByCategory(problemsData)
  const notOnTableMobileView = mobileView !== "table"
  return (
    <div
      className={`${
        notOnTableMobileView ? "hidden sm:block" : ""
      } size-full overflow-auto overflow-x-scroll `}
    >
      <DataTable
        columns={columns}
        handleRowClick={handleRowClick}
        data={formattedData}
      />
    </div>
  )
}

export default ProblemsTable
