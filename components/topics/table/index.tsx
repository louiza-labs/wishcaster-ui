import { summarizeByCategory } from "@/lib/helpers"
import { DataTable } from "@/components/ui/data-table"
import { generateColumns } from "@/components/ui/data-table/columns"

interface Column {
  accessorKey: string
  title: string
}
interface TopicsTableProps {
  topicsData: any[]
}
const TopicsTable = ({ topicsData }: TopicsTableProps) => {
  const columnsConfig: Column[] = [
    // { accessorKey: "id", title: "Hash" },
    { accessorKey: "topic", title: "Topic" },
    { accessorKey: "count", title: "Count" },

    { accessorKey: "likes", title: "Likes" },
    { accessorKey: "priority-likes", title: "Priority Likes" },
    { accessorKey: "recasts", title: "Recasts" },
    { accessorKey: "replies", title: "Replies" },
    { accessorKey: "averageFollowerCount", title: "Avg. Followers" },
    // { accessorKey: "powerBadgeCount", title: "Power Badges" },
  ]

  const columns = generateColumns(columnsConfig)
  const formattedData = summarizeByCategory(topicsData)

  return <DataTable columns={columns} data={formattedData} />
}

export default TopicsTable
