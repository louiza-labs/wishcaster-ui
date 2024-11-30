"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center p-8 text-center",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="bg-muted inline-block rounded-full p-4"
        >
          <Search className="text-muted-foreground size-8" />
        </motion.div>
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mx-auto max-w-[350px]">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-4">
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  )
}
