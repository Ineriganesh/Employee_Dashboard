import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Switch,
  Chip,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
  TablePagination,
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';
import { Employee, FilterStatus, FilterGender, EmployeeFormData } from '@/types/employee';
import { useEmployees } from '@/contexts/EmployeeContext';
import EmployeeFilters from './EmployeeFilters';
import EmployeeForm from './EmployeeForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const EmployeeTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const printRef = useRef<HTMLDivElement>(null);

  const { employees, toggleEmployeeStatus, deleteEmployee, addEmployee, updateEmployee, getEmployee } =
    useEmployees();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [genderFilter, setGenderFilter] = useState<FilterGender>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && emp.isActive) ||
        (statusFilter === 'inactive' && !emp.isActive);
      const matchesGender = genderFilter === 'all' || emp.gender === genderFilter;

      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [employees, searchQuery, statusFilter, genderFilter]);

  const paginatedEmployees = useMemo(() => {
    return filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredEmployees, page, rowsPerPage]);

  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data);
    } else {
      addEmployee(data);
    }
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee List</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1565C0; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #1565C0; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .status-active { color: #2e7d32; font-weight: bold; }
            .status-inactive { color: #d32f2f; font-weight: bold; }
            .print-date { color: #666; font-size: 12px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Employee List</h1>
          <p class="print-date">Printed on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees
                .map(
                  (emp) => `
                <tr>
                  <td>${emp.id}</td>
                  <td>${emp.fullName}</td>
                  <td>${emp.gender}</td>
                  <td>${new Date(emp.dateOfBirth).toLocaleDateString()}</td>
                  <td>${emp.state}</td>
                  <td class="${emp.isActive ? 'status-active' : 'status-inactive'}">
                    ${emp.isActive ? 'Active' : 'Inactive'}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isMobile) {
    return (
      <Box>
        <EmployeeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          genderFilter={genderFilter}
          onGenderChange={setGenderFilter}
          onAddClick={handleAddClick}
          onPrintClick={handlePrint}
        />

        {filteredEmployees.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography color="text.secondary">No employees found</Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {paginatedEmployees.map((employee) => (
              <Card
                key={employee.id}
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={employee.profileImage} sx={{ width: 60, height: 60 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {employee.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.id} • {employee.gender}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.state}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          label={employee.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={employee.isActive ? 'success' : 'error'}
                          variant="outlined"
                        />
                        <Box sx={{ ml: 'auto' }}>
                          <IconButton size="small" onClick={() => handleEditClick(employee)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(employee)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />

        <EmployeeForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          employee={editingEmployee}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          employeeName={employeeToDelete?.fullName || ''}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    );
  }

  return (
    <Box>
      <EmployeeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        genderFilter={genderFilter}
        onGenderChange={setGenderFilter}
        onAddClick={handleAddClick}
        onPrintClick={handlePrint}
      />

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>State</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography color="text.secondary">No employees found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {employee.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={employee.profileImage} sx={{ width: 44, height: 44 }} />
                        <Typography fontWeight={500}>{employee.fullName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.gender}</TableCell>
                    <TableCell>{formatDate(employee.dateOfBirth)}</TableCell>
                    <TableCell>{employee.state}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          checked={employee.isActive}
                          onChange={() => toggleEmployeeStatus(employee.id)}
                          color="success"
                          size="small"
                        />
                        <Chip
                          label={employee.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={employee.isActive ? 'success' : 'error'}
                          variant="outlined"
                          sx={{ minWidth: 70 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(employee)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(employee)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Paper>

      <EmployeeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        employeeName={employeeToDelete?.fullName || ''}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default EmployeeTable;
