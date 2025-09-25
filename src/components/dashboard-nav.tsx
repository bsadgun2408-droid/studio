"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  History,
  LayoutGrid,
  MessageSquare,
  Video,
  GraduationCap,
} from "lucide-react";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Tutor" },
  { href: "/dashboard/analyze-notes", icon: FileText, label: "Analyze Notes" },
  { href: "/dashboard/study-materials", icon: BookOpen, label: "Study Materials" },
  { href: "/dashboard/calls", icon: Video, label: "Live Calls" },
  { href: "/dashboard/history", icon: History, label: "History" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold font-headline">EduAI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "bg-accent text-accent-foreground" }}
                  className={cn(
                    "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                  )}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
