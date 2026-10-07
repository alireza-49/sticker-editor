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
      variant='floating'
      className='h-[calc(100svh-3.5rem)] top-[3.5rem]'
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Options.map((option, index) => (
                <SidebarMenuItem key={index}>
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
                </SidebarMenuItem>
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
