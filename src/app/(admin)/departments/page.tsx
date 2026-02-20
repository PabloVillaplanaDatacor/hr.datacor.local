"use client";

import { useState, useMemo } from "react";
import { useHR } from "@/lib/store";
import { Department } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";

const emptyForm: Omit<Department, "id"> = {
  name: "",
  description: "",
  managerId: null,
  budget: 0,
  location: "",
  createdAt: new Date().toISOString().split("T")[0],
  headcount: 0,
};

export default function DepartmentsPage() {
  const { departments, employees, addDepartment, updateDepartment, deleteDepartment } = useHR();
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [viewingDept, setViewingDept] = useState<Department | null>(null);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);
  const [form, setForm] = useState<Omit<Department, "id">>(emptyForm);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return departments.filter(
      (d) =>
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
    );
  }, [departments, search]);

  function getHeadcount(deptId: string) {
    return employees.filter((e) => e.departmentId === deptId).length;
  }

  function getManagerName(managerId: string | null) {
    if (!managerId) return "—";
    const emp = employees.find((e) => e.id === managerId);
    return emp ? `${emp.firstName} ${emp.lastName}` : "—";
  }

  function openCreate() {
    setEditingDept(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  }

  function openEdit(dept: Department) {
    setEditingDept(dept);
    const { id, ...rest } = dept;
    void id;
    setForm(rest);
    setDialogOpen(true);
  }

  function openView(dept: Department) {
    setViewingDept(dept);
    setViewDialogOpen(true);
  }

  function openDelete(dept: Department) {
    setDeletingDept(dept);
    setDeleteDialogOpen(true);
  }

  function handleSave() {
    if (!form.name) return;
    if (editingDept) {
      updateDepartment(editingDept.id, form);
    } else {
      addDepartment(form);
    }
    setDialogOpen(false);
  }

  function handleDelete() {
    if (!deletingDept) return;
    deleteDepartment(deletingDept.id);
    setDeleteDialogOpen(false);
    setDeletingDept(null);
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {departments.slice(0, 4).map((dept) => (
          <Card
            key={dept.id}
            className="shadow-none border cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => openView(dept)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-slate-50">
                  {getHeadcount(dept.id)} people
                </Badge>
              </div>
              <p className="text-sm font-semibold text-foreground">{dept.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{dept.description}</p>
              <div className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {dept.location}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="shadow-none border">
        <CardHeader className="px-5 py-3 border-b">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>
              {filtered.length} department{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5 w-48">Department</TableHead>
                <TableHead className="hidden sm:table-cell">Manager</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Headcount</TableHead>
                <TableHead className="hidden lg:table-cell text-right">Budget</TableHead>
                <TableHead className="hidden xl:table-cell">Since</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground text-sm"
                  >
                    No departments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((dept) => (
                  <TableRow key={dept.id} className="group">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{dept.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {dept.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {getManagerName(dept.managerId)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {dept.location}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {getHeadcount(dept.id)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-right font-medium">
                      ${(dept.budget / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                      {new Date(dept.createdAt).getFullYear()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openView(dept)}>
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(dept)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => openDelete(dept)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingDept ? "Edit Department" : "Add Department"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1.5">
              <Label>Department Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Engineering"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Manager</Label>
              <Select
                value={form.managerId ?? "none"}
                onValueChange={(v) =>
                  setForm({ ...form, managerId: v === "none" ? null : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No manager</SelectItem>
                  {employees
                    .filter((e) => e.role === "manager" || e.role === "admin")
                    .map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.firstName} {e.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Floor 3 - Building A"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Annual Budget (USD)</Label>
              <Input
                type="number"
                value={form.budget || ""}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                placeholder="500000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Created Date</Label>
              <Input
                type="date"
                value={form.createdAt}
                onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingDept ? "Save Changes" : "Add Department"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {viewingDept && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold">{viewingDept.name}</p>
                  <p className="text-sm text-muted-foreground">{viewingDept.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Manager", value: getManagerName(viewingDept.managerId), icon: Users },
                  { label: "Location", value: viewingDept.location, icon: MapPin },
                  {
                    label: "Headcount",
                    value: `${getHeadcount(viewingDept.id)} employees`,
                    icon: Users,
                  },
                  {
                    label: "Budget",
                    value: `$${viewingDept.budget.toLocaleString()}`,
                    icon: DollarSign,
                  },
                  {
                    label: "Founded",
                    value: new Date(viewingDept.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    }),
                    icon: Building2,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                        {label}
                      </p>
                    </div>
                    <p className="text-sm text-foreground">{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false);
                openEdit(viewingDept!);
              }}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{deletingDept?.name}</span>? This will
            not remove employees. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
