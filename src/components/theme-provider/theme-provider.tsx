"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from "../ui/sidebar";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <SidebarProvider>{children}</SidebarProvider>
    </NextThemesProvider>
  );
}
