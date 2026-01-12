import { Employee } from '@/types/employee';

const avatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
];

export const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    fullName: 'Rajesh Kumar',
    gender: 'Male',
    dateOfBirth: '1990-05-15',
    state: 'Maharashtra',
    profileImage: avatars[0],
    isActive: true,
    createdAt: '2024-01-10',
  },
  {
    id: 'EMP002',
    fullName: 'Priya Sharma',
    gender: 'Female',
    dateOfBirth: '1992-08-22',
    state: 'Delhi',
    profileImage: avatars[1],
    isActive: true,
    createdAt: '2024-01-12',
  },
  {
    id: 'EMP003',
    fullName: 'Amit Patel',
    gender: 'Male',
    dateOfBirth: '1988-03-10',
    state: 'Gujarat',
    profileImage: avatars[2],
    isActive: false,
    createdAt: '2024-01-15',
  },
  {
    id: 'EMP004',
    fullName: 'Sneha Reddy',
    gender: 'Female',
    dateOfBirth: '1995-11-30',
    state: 'Karnataka',
    profileImage: avatars[3],
    isActive: true,
    createdAt: '2024-01-18',
  },
  {
    id: 'EMP005',
    fullName: 'Vikram Singh',
    gender: 'Male',
    dateOfBirth: '1991-07-08',
    state: 'Punjab',
    profileImage: avatars[4],
    isActive: true,
    createdAt: '2024-01-20',
  },
  {
    id: 'EMP006',
    fullName: 'Anita Desai',
    gender: 'Female',
    dateOfBirth: '1993-02-14',
    state: 'Rajasthan',
    profileImage: avatars[5],
    isActive: false,
    createdAt: '2024-01-22',
  },
];

export const generateEmployeeId = (employees: Employee[]): string => {
  const maxId = employees.reduce((max, emp) => {
    const num = parseInt(emp.id.replace('EMP', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `EMP${String(maxId + 1).padStart(3, '0')}`;
};
