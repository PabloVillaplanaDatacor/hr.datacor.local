"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Dashboard", description: "Welcome back, overview of your organization" },
  "/employees": { title: "Employees", description: "Manage your workforce" },
  "/departments": { title: "Departments", description: "Manage your organizational structure" },
  "/settings": { title: "Settings", description: "System preferences" },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "HR Datacor", description: "" };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 gap-4">
      <div>
        <h1 className="text-base font-semibold text-foreground leading-tight">{page.title}</h1>
        <p className="text-xs text-muted-foreground">{page.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-52 pl-8 text-sm bg-muted/40 border-border/60"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div>
                <p className="text-sm font-medium">New employee onboarded</p>
                <p className="text-xs text-muted-foreground">Grace Robinson joined Operations</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div>
                <p className="text-sm font-medium">Leave request pending</p>
                <p className="text-xs text-muted-foreground">Liam Nguyen — 5 days</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div>
                <p className="text-sm font-medium">Budget review due</p>
                <p className="text-xs text-muted-foreground">Engineering Q1 budget</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
