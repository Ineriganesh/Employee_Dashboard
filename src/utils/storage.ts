import { Employee } from '@/types/employee';
import { initialEmployees } from './mockData';

const EMPLOYEES_KEY = 'employees_data';
const AUTH_KEY = 'auth_state';

export const getEmployeesFromStorage = (): Employee[] => {
  const stored = localStorage.getItem(EMPLOYEES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with mock data
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(initialEmployees));
  return initialEmployees;
};

export const saveEmployeesToStorage = (employees: Employee[]): void => {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

export const getAuthState = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const setAuthState = (isAuthenticated: boolean): void => {
  localStorage.setItem(AUTH_KEY, String(isAuthenticated));
};

export const clearAuthState = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
