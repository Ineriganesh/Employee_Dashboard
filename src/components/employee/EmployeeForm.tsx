import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Avatar,
  IconButton,
  Typography,
  Alert,
  useMediaQuery,
  useTheme,
  Drawer,
} from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import { EmployeeFormData, Employee } from '@/types/employee';
import { indianStates } from '@/utils/indianStates';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee | null;
}

const initialFormData: EmployeeFormData = {
  fullName: '',
  gender: '',
  dateOfBirth: '',
  state: '',
  profileImage: '',
  isActive: true,
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const isEdit = !!employee;

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        gender: employee.gender,
        dateOfBirth: employee.dateOfBirth,
        state: employee.state,
        profileImage: employee.profileImage,
        isActive: employee.isActive,
      });
      setImagePreview(employee.profileImage);
    } else {
      setFormData(initialFormData);
      setImagePreview('');
    }
    setErrors({});
  }, [employee, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18 || age > 100) {
        newErrors.dateOfBirth = 'Employee must be between 18 and 100 years old';
      }
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: 'Image must be less than 5MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, profileImage: result }));
        setErrors((prev) => ({ ...prev, profileImage: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid =
    formData.fullName.trim().length >= 2 &&
    formData.gender &&
    formData.dateOfBirth &&
    formData.state;

  const formContent = (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar
            src={imagePreview}
            sx={{ width: 100, height: 100, border: '3px solid', borderColor: 'primary.light' }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="profile-image-upload">
            <Button
              variant="outlined"
              size="small"
              component="span"
              startIcon={<PhotoCamera />}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Upload Photo
            </Button>
          </label>
          {errors.profileImage && (
            <Typography color="error" variant="caption">
              {errors.profileImage}
            </Typography>
          )}
        </Box>

        <TextField
          label="Full Name"
          fullWidth
          required
          value={formData.fullName}
          onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <FormControl fullWidth required error={!!errors.gender}>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            label="Gender"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gender: e.target.value as 'Male' | 'Female' | 'Other' | '',
              }))
            }
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          {errors.gender && (
            <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
              {errors.gender}
            </Typography>
          )}
        </FormControl>

        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={formData.dateOfBirth}
          onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth}
        />

        <FormControl fullWidth required error={!!errors.state}>
          <InputLabel>State</InputLabel>
          <Select
            value={formData.state}
            label="State"
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 300 },
              },
            }}
          >
            {indianStates.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
          {errors.state && (
            <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
              {errors.state}
            </Typography>
          )}
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              color="success"
            />
          }
          label={formData.isActive ? 'Active' : 'Inactive'}
        />
      </Box>
    </>
  );

  if (isMobile) {
    return (
      <Drawer anchor="bottom" open={open} onClose={onClose}>
        <Box sx={{ p: 3, maxHeight: '90vh', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              {isEdit ? 'Edit Employee' : 'Add New Employee'}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          {formContent}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button fullWidth variant="outlined" onClick={onClose} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid}
              sx={{ borderRadius: 2 }}
            >
              {isEdit ? 'Update' : 'Add'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>{formContent}</DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button variant="outlined" onClick={onClose} sx={{ textTransform: 'none', borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid}
          sx={{ textTransform: 'none', borderRadius: 2, px: 4 }}
        >
          {isEdit ? 'Update Employee' : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
