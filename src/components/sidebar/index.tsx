"use client";
import React, { useState } from "react";
import {
  Sidebar as ShadSideBar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  CropIcon,
  EraserIcon,
  FilterIcon,
  LucideIcon,
  SettingsIcon,
  StickerIcon,
  TextIcon,
} from "lucide-react";
import Layers from "./layers";
import FiltersMenu from "./filters";
import { SidebarMenuItemWithExpansion } from "../ui/sidebarMenuItemWithExpantion";

const Options: { icon: LucideIcon; title: string }[] = [
  { icon: CropIcon, title: "Crop/Resize" },
  { icon: TextIcon, title: "Text" },
  { icon: StickerIcon, title: "Stickers" },
  { icon: FilterIcon, title: "Filters/Effects" },
  { icon: SettingsIcon, title: "Adjustments" },
  { icon: EraserIcon, title: "Erase" },
];

const SideBar = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <ShadSideBar
      variant='sidebar'
      className='h-[calc(100svh-3.5rem)] top-[3.5rem] relative'
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Options.map((option, index) => (
                <SidebarMenuItemWithExpansion
                  contentInside={<div>lklkml</div>}
                  key={index}
                >
                  <SidebarMenuButton
                    onClick={
                      option.title === "Filters/Effects"
                        ? () => setFiltersOpen(true)
                        : undefined
                    }
                  >
                    {<option.icon />}
                    <span>{option.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItemWithExpansion>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <Layers />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <FiltersMenu open={filtersOpen} onOpenChange={setFiltersOpen} />
    </ShadSideBar>
  );
};

export default SideBar;
