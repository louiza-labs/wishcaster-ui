"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbsProps {
  pages: {
    name: string
    link: string
  }[]
}

export function Breadcrumbs({ pages }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <p className="font-medium text-slate-400 dark:text-slate-200">/</p>
        </BreadcrumbSeparator>
        {pages.map((page, index) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={page.link}>{page.name}</BreadcrumbLink>
            </BreadcrumbItem>
            {index === pages.length - 1 ? null : (
              <BreadcrumbSeparator>
                <p className="font-medium text-slate-400 dark:text-slate-200">
                  /
                </p>
              </BreadcrumbSeparator>
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
