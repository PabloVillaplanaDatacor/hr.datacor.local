"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/departments", label: "Departments", icon: Building2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
            Datacor HR
          </span>
          <span className="text-[11px] text-sidebar-foreground/50 font-medium uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Main Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User profile */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
          <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-bold">
            AD
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight flex-1 min-w-0">
          <span className="text-sm font-semibold text-sidebar-foreground truncate">
            Admin User
          </span>
          <span className="text-[11px] text-sidebar-foreground/50 truncate">
            admin@datacor.com
          </span>
        </div>
        <button className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
