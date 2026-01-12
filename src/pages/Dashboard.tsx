import React from 'react';
import { Box, Typography } from '@mui/material';
import AppLayout from '@/components/layout/AppLayout';
import SummaryCards from '@/components/employee/SummaryCards';
import EmployeeTable from '@/components/employee/EmployeeTable';
import { EmployeeProvider } from '@/contexts/EmployeeContext';

const Dashboard: React.FC = () => {
  return (
    <EmployeeProvider>
      <AppLayout>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your employees and track their status
          </Typography>
        </Box>

        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <SummaryCards />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Employee List
          </Typography>
          <EmployeeTable />
        </Box>
      </AppLayout>
    </EmployeeProvider>
  );
};

export default Dashboard;
