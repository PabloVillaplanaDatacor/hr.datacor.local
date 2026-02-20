"use client";

import React, { createContext, useContext, useState } from "react";
import { Department, Employee } from "./types";
import { departments as initialDepartments, employees as initialEmployees } from "./data";

interface HRStore {
  employees: Employee[];
  departments: Department[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDepartment: (department: Omit<Department, "id">) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
}

const HRContext = createContext<HRStore | null>(null);

export function HRProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  function addEmployee(data: Omit<Employee, "id">) {
    const newEmployee: Employee = { ...data, id: `emp-${Date.now()}` };
    setEmployees((prev) => [...prev, newEmployee]);
  }

  function updateEmployee(id: string, data: Partial<Employee>) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...data } : e))
    );
  }

  function deleteEmployee(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  function addDepartment(data: Omit<Department, "id">) {
    const newDept: Department = { ...data, id: `dept-${Date.now()}` };
    setDepartments((prev) => [...prev, newDept]);
  }

  function updateDepartment(id: string, data: Partial<Department>) {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
  }

  function deleteDepartment(id: string) {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <HRContext.Provider
      value={{
        employees,
        departments,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addDepartment,
        updateDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </HRContext.Provider>
  );
}

export function useHR() {
  const ctx = useContext(HRContext);
  if (!ctx) throw new Error("useHR must be used inside HRProvider");
  return ctx;
}
