import { cookies } from "next/headers"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { 
  SidebarInset, 
  SidebarProvider,
} from '@/components/ui/sidebar';
import { AppSidebar, MobileSidebar } from "@/components/layout/app-sidebar"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HaruChat AI",
  description: "Chat with AI companions",
  icons: {
    icon: '/favicon.ico',
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const defaultOpen = Cookies.get("sidebar_state") === "true";
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
              
                {/* Mobile bottom navigation */}
                <MobileSidebar />
              </div>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
