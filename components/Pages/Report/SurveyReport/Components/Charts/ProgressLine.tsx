"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  total: number
  bgColor?: string // Add bgColor prop
}

const ProgressLine = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, total, bgColor = "bg-slate-900", ...props }, ref) => {
    // const progressPercentage = total > 0 ? (value / total) * 100 : 0;
    const progressPercentage = total === 0 ? 0 : (value / total) * 100

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
          className
        )}
        {...props}
      >
               {progressPercentage > 0 && (
          <ProgressPrimitive.Indicator
          className={cn("h-full flex-1 transition-all", bgColor)} // Apply dynamic bgColor
          // style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
          style={{ width: `${progressPercentage}%` }}
        /> 
        )}
      </ProgressPrimitive.Root>
    )
  }
)

ProgressLine.displayName = "Progress"



export { ProgressLine }

