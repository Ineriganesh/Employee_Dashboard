import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, Add, Print } from '@mui/icons-material';
import { FilterStatus, FilterGender } from '@/types/employee';

interface EmployeeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  genderFilter: FilterGender;
  onGenderChange: (gender: FilterGender) => void;
  onAddClick: () => void;
  onPrintClick: () => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  genderFilter,
  onGenderChange,
  onAddClick,
  onPrintClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          flex: 1,
        }}
      >
        <TextField
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: 250 },
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={genderFilter}
            label="Gender"
            onChange={(e) => onGenderChange(e.target.value as FilterGender)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <MenuItem value="all">All Gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          variant="outlined"
          startIcon={<Print />}
          onClick={onPrintClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {isMobile ? '' : 'Print'}
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddClick}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
          }}
        >
          Add Employee
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeFilters;
