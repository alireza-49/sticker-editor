"use client";
import React, { useState } from "react";
import {
  Sidebar as ShadSideBar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ImagesIcon, LucideIcon } from "lucide-react";
import Layers from "./layers";
import FiltersMenu from "./filters";
import { SidebarMenuItemWithExpansion } from "../ui/sidebarMenuItemWithExpantion";
import Assests from "./assest";

const Options: {
  icon: LucideIcon;
  component: React.ComponentType;
  title: string;
}[] = [
  { icon: ImagesIcon, title: "Assests", component: Assests },
  // { icon: CropIcon, title: "Crop/Resize" },
  // { icon: TextIcon, title: "Text" },
  // { icon: StickerIcon, title: "Stickers" },
  // { icon: FilterIcon, title: "Filters/Effects" },
  // { icon: SettingsIcon, title: "Adjustments" },
  // { icon: EraserIcon, title: "Erase" },
];

const SideBar = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <ShadSideBar
      variant='sidebar'
      className='h-[calc(100svh-3.5rem)] top-[3.5rem] relative'
    >
      <SidebarContent className='overflow-hidden'>
        <SidebarGroup className='min-h-[50%]'>
          <SidebarGroupContent>
            <SidebarMenu>
              {Options.map((option, index) => (
                <SidebarMenuItemWithExpansion
                  contentInside={<option.component />}
                  key={index}
                  title={option.title}
                >
                  <SidebarMenuButton>
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
