export type EmployeeStatus = "active" | "inactive" | "on-leave";
export type EmployeeRole = "admin" | "manager" | "employee" | "intern";

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  budget: number;
  location: string;
  createdAt: string;
  headcount: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  salary: number;
  startDate: string;
  avatar: string;
  address: string;
}
