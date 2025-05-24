import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { 
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar, MobileSidebar } from "@/components/layout/app-sidebar"
import Cookies from 'js-cookie';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HaruChat AI",
  description: "Chat with AI companions",
};


// This would be the RootLayout in Next.js
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const defaultOpen = Cookies.get("sidebar_state") === "true";
  
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />

        {/* Main content with inset */}
        <SidebarInset>
          {/* Main content */}
          <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          
            {/* Mobile bottom navigation - only show on main routes */}
            <MobileSidebar />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
};

export default RootLayout;
