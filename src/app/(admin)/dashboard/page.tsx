"use client";

import { useHR } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Building2,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
} from "lucide-react";

const statusConfig = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", className: "bg-red-100 text-red-700 border-red-200" },
  "on-leave": { label: "On Leave", className: "bg-amber-100 text-amber-700 border-amber-200" },
} as const;

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="shadow-none border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { employees, departments } = useHR();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on-leave").length;
  const inactive = employees.filter((e) => e.status === "inactive").length;
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  const departmentStats = departments.map((d) => ({
    ...d,
    count: employees.filter((e) => e.departmentId === d.id).length,
  }));

  function getDepartmentName(departmentId: string) {
    return departments.find((d) => d.id === departmentId)?.name ?? "Unknown";
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          sub={`${departments.length} departments`}
          icon={Users}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          title="Active"
          value={activeEmployees}
          sub={
            totalEmployees > 0
              ? `${Math.round((activeEmployees / totalEmployees) * 100)}% of workforce`
              : "—"
          }
          icon={UserCheck}
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title="On Leave"
          value={onLeave}
          sub={`${inactive} inactive`}
          icon={Clock}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Avg. Salary"
          value={`$${avgSalary.toLocaleString()}`}
          sub={`$${(totalPayroll / 1000).toFixed(0)}k total payroll`}
          icon={DollarSign}
          color="bg-violet-100 text-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Overview */}
        <Card className="lg:col-span-1 shadow-none border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departmentStats.map((dept) => {
              const pct =
                totalEmployees > 0
                  ? Math.round((dept.count / totalEmployees) * 100)
                  : 0;
              return (
                <div key={dept.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">{dept.count} employees</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Hires */}
        <Card className="lg:col-span-2 shadow-none border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Hires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEmployees.map((emp) => {
                const status = statusConfig[emp.status];
                const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
                return (
                  <div key={emp.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[11px] font-semibold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {emp.position} · {getDepartmentName(emp.departmentId)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:block text-xs text-muted-foreground">
                        {new Date(emp.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${status.className}`}
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-none border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{activeEmployees}</p>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{onLeave}</p>
              <p className="text-xs text-muted-foreground">On leave</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{inactive}</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
