import React, { useId, useState, type ReactNode } from "react";
import { cn } from "cn";

export interface SidebarMenuItemWithExpansionProps extends React.ComponentProps<"li"> {
  contentInside: ((props: { close: () => void }) => ReactNode) | ReactNode;
  title?: string;
  onOpenChange?: (open: boolean) => void;
}

export function SidebarMenuItemWithExpansion({
  className,
  contentInside,
  children,
  title,
  onOpenChange,
  ...props
}: SidebarMenuItemWithExpansionProps) {
  const [expanded, setExpanded] = useState(false);
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "_");
  const anchorName = `--menu-item-${rawId}`;

  const handleOpen = () => {
    setExpanded(true);
    onOpenChange?.(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpanded(false);
    onOpenChange?.(false);
  };

  return (
    <li
      onClick={handleOpen}
      data-slot='sidebar-menu-item'
      data-sidebar='menu-item'
      className={cn("group/menu-item list-none", className)}
      style={
        {
          anchorName: anchorName,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className='w-full cursor-pointer'>{children}</div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute z-50 overflow-hidden bg-zinc-900 text-zinc-100 shadow-2xl transition-all duration-300",
          expanded
            ? "pointer-events-auto rounded-md opacity-100 border-1 border-mist-700"
            : "pointer-events-none rounded-b-md opacity-0 ",
        )}
        style={
          {
            positionAnchor: anchorName,

            top: expanded ? "0px" : `anchor(top)`,
            left: expanded ? "0px" : `anchor(left)`,
            width: expanded ? "100%" : `anchor-size(width)`,
            height: expanded ? "100%" : `anchor-size(height)`,
          } as React.CSSProperties
        }
      >
        <div className='flex h-full w-full flex-col p-4'>
          <div className='mb-3 flex items-center justify-between border-b border-zinc-800 pb-2'>
            <button
              type='button'
              onClick={handleClose}
              className='inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white'
            >
              ← Back
            </button>
            {title && (
              <span className='text-xs font-semibold text-zinc-300'>
                {title}
              </span>
            )}
          </div>

          <div className='flex-1 overflow-y-auto'>
            {typeof contentInside === "function"
              ? contentInside({ close: () => handleClose() })
              : contentInside}
          </div>
        </div>
      </div>
    </li>
  );
}
