"use client"


import * as React from "react"
import {
  GalleryVerticalEnd,
  Home, MessageSquare, Star, User
} from "lucide-react"

import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils"

// This is sample data.
const data = {
  brand: 
    {
      name: "HaruChat AI",
      logo: GalleryVerticalEnd,
    },
  nav: [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Chat",
      url: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Collections",
      url: "/collections",
      icon: Star,
    },
    {
      name: "Me",
      url: "/me",
      icon: User,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Sidebar collapsible="icon" className="z-[60] ease-out" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={toggleSidebar}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <data.brand.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {data.brand.name}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.nav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                  tooltip={item.name}
                    asChild
                    isActive={item.name === "Home"}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function MobileNavbar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  // Check if we are on a main route (not a nested page)
  const isMainRoute = 
    pathname === '/' || 
    pathname === '/chat' ||
    pathname === '/collections' ||
    pathname === '/me';

  if (!isMobile || !isMainRoute) {
    return null;
  }
  return (
    <>
      <div className="h-[56px]"/>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-[55]">
        <nav className="flex justify-around items-center">
          {data.nav.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "flex flex-col items-center p-2 text-sm rounded-md transition-colors",
                pathname === item.url 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}