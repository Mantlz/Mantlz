"use client"

import React, { useMemo } from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const BreadcrumbNav = React.memo(function BreadcrumbNav() {
  const pathname = usePathname()
  
  const segments = useMemo(() => {
    return pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index, array) => {
        // Format title - capitalize first letter and add ellipsis if longer than 5 characters
        const formattedTitle = segment.length > 9
          ? `${segment.charAt(0).toUpperCase()}${segment.slice(1, 9)}...` 
          : segment.charAt(0).toUpperCase() + segment.slice(1)

        return {
          title: formattedTitle,
          fullTitle: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: `/${array.slice(0, index + 1).join("/")}`,
        }
      })
  }, [pathname])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage title={segment.fullTitle}>{segment.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.href} title={segment.fullTitle}>
                  {segment.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
})

export default BreadcrumbNav