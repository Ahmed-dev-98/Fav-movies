import React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TableCellContentProps {
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
  truncate?: boolean;
}

const TableCellContent: React.FC<TableCellContentProps> = ({
  children,
  className,
  tooltip,
  truncate = true,
}) => {
  // If we have a tooltip, use it; otherwise try to extract text from children
  const getTooltipText = () => {
    if (tooltip) return tooltip;

    // Try to extract text content from React children
    if (typeof children === "string") return children;
    if (typeof children === "number") return children.toString();

    // For complex children, try to extract text
    try {
      const textContent = React.Children.toArray(children)
        .map((child) => {
          if (typeof child === "string" || typeof child === "number") {
            return child.toString();
          }
          return "";
        })
        .join(" ")
        .trim();

      return textContent || undefined;
    } catch {
      return undefined;
    }
  };

  const tooltipText = getTooltipText();

  // If no tooltip text, just return the content without tooltip wrapper
  if (!tooltipText) {
    return (
      <div className={cn(truncate ? "truncate" : "", className)}>
        {children}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(truncate ? "truncate" : "", className)}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TableCellContent;
