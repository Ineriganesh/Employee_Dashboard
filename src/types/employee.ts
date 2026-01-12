export interface Employee {
  id: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  state: string;
  profileImage: string;
  isActive: boolean;
  createdAt: string;
}

export interface EmployeeFormData {
  fullName: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  dateOfBirth: string;
  state: string;
  profileImage: string;
  isActive: boolean;
}

export type FilterStatus = 'all' | 'active' | 'inactive';
export type FilterGender = 'all' | 'Male' | 'Female' | 'Other';
