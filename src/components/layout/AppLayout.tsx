import React from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LogoutOutlined, DashboardOutlined } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DashboardOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Employee Dashboard
            </Typography>
          </Box>
          {isMobile ? (
            <IconButton onClick={handleLogout} color="primary" size="large">
              <LogoutOutlined />
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LogoutOutlined />}
              onClick={handleLogout}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          py: { xs: 2, sm: 3 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;
