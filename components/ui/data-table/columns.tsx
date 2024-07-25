"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table/column-header"

// Define a type for the columns you want to include
interface Column {
  accessorKey: string
  title: string
}

// Example usage with an array of columns

// Function to generate column definitions
export const generateColumns = (columns: Column[]): ColumnDef<any, any>[] => {
  return columns.map(({ accessorKey, title }) => ({
    accessorKey: accessorKey,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={title} className="p-4" />
    ),
    cell: ({ getValue }) => (
      <div className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
        {getValue()}
      </div>
    ),
    enableSorting: true, // Assuming all columns can potentially be sorted
  }))
}
