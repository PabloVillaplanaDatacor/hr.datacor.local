"use client";

import { useState } from "react";
import { useHR } from "@/lib/store";
import { Employee, EmployeeStatus, EmployeeRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<EmployeeStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", className: "bg-rose-100 text-rose-700 border-rose-200" },
  "on-leave": { label: "On Leave", className: "bg-amber-100 text-amber-700 border-amber-200" },
};

const roleConfig: Record<EmployeeRole, string> = {
  admin: "bg-violet-100 text-violet-700 border-violet-200",
  manager: "bg-blue-100 text-blue-700 border-blue-200",
  employee: "bg-slate-100 text-slate-600 border-slate-200",
  intern: "bg-orange-100 text-orange-700 border-orange-200",
};

const emptyForm: Omit<Employee, "id"> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  position: "",
  departmentId: "",
  status: "active",
  role: "employee",
  salary: 0,
  startDate: new Date().toISOString().split("T")[0],
  avatar: "",
  address: "",
};

export default function EmployeesPage() {
  const { employees, departments, addEmployee, updateEmployee, deleteEmployee } = useHR();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | "all">("all");
  const [filterDept, setFilterDept] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<Omit<Employee, "id">>(emptyForm);

  const filtered = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    const matchDept = filterDept === "all" || e.departmentId === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  function openCreate() {
    setEditingEmployee(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(employee: Employee) {
    setEditingEmployee(employee);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = employee;
    setForm(rest);
    setDialogOpen(true);
  }

  function openDelete(employee: Employee) {
    setDeletingEmployee(employee);
    setDeleteDialogOpen(true);
  }

  function handleSubmit() {
    if (!form.firstName || !form.lastName || !form.email || !form.departmentId) return;
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, form);
    } else {
      addEmployee({
        ...form,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.firstName}${form.lastName}`,
      });
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (deletingEmployee) {
      deleteEmployee(deletingEmployee.id);
      setDeleteDialogOpen(false);
    }
  }

  const getDeptName = (id: string) => departments.find((d) => d.id === id)?.name ?? "—";

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {employees.length} total · {employees.filter((e) => e.status === "active").length} active
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as EmployeeStatus | "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[280px]">Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <p className="text-sm font-semibold">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{getDeptName(emp.departmentId)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{emp.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs capitalize", roleConfig[emp.role])}>
                      {emp.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs capitalize", statusConfig[emp.status].className)}>
                      {statusConfig[emp.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    ${emp.salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(emp.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(emp)} className="gap-2">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDelete(emp)}
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>First Name *</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="James"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Last Name *</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Carter"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="james.carter@datacor.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Position</Label>
              <Input
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Department *</Label>
              <Select
                value={form.departmentId}
                onValueChange={(v) => setForm({ ...form, departmentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as EmployeeRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as EmployeeStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Salary (USD / year)</Label>
              <Input
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                placeholder="80000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Plus className="h-4 w-4 mr-1.5" />
              {editingEmployee ? "Save Changes" : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {deletingEmployee?.firstName} {deletingEmployee?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
