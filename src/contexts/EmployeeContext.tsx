import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Employee, EmployeeFormData } from '@/types/employee';
import { getEmployeesFromStorage, saveEmployeesToStorage } from '@/utils/storage';
import { generateEmployeeId } from '@/utils/mockData';

interface EmployeeContextType {
  employees: Employee[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  addEmployee: (data: EmployeeFormData) => void;
  updateEmployee: (id: string, data: EmployeeFormData) => void;
  deleteEmployee: (id: string) => void;
  toggleEmployeeStatus: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const stored = getEmployeesFromStorage();
    setEmployees(stored);
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      saveEmployeesToStorage(employees);
    }
  }, [employees]);

  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.isActive).length;
  const inactiveCount = employees.filter((e) => !e.isActive).length;

  const addEmployee = useCallback((data: EmployeeFormData) => {
    setEmployees((prev) => {
      const newEmployee: Employee = {
        id: generateEmployeeId(prev),
        fullName: data.fullName,
        gender: data.gender as 'Male' | 'Female' | 'Other',
        dateOfBirth: data.dateOfBirth,
        state: data.state,
        profileImage: data.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        isActive: data.isActive,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return [...prev, newEmployee];
    });
  }, []);

  const updateEmployee = useCallback((id: string, data: EmployeeFormData) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              fullName: data.fullName,
              gender: data.gender as 'Male' | 'Female' | 'Other',
              dateOfBirth: data.dateOfBirth,
              state: data.state,
              profileImage: data.profileImage || emp.profileImage,
              isActive: data.isActive,
            }
          : emp
      )
    );
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees((prev) => {
      const updated = prev.filter((emp) => emp.id !== id);
      saveEmployeesToStorage(updated);
      return updated;
    });
  }, []);

  const toggleEmployeeStatus = useCallback((id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, isActive: !emp.isActive } : emp))
    );
  }, []);

  const getEmployee = useCallback(
    (id: string) => employees.find((emp) => emp.id === id),
    [employees]
  );

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        totalCount,
        activeCount,
        inactiveCount,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        getEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
