import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { PeopleOutline, CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import { useEmployees } from '@/contexts/EmployeeContext';

const SummaryCards: React.FC = () => {
  const { totalCount, activeCount, inactiveCount } = useEmployees();

  const cards = [
    {
      title: 'Total Employees',
      count: totalCount,
      icon: <PeopleOutline sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Active Employees',
      count: activeCount,
      icon: <CheckCircleOutline sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light',
    },
    {
      title: 'Inactive Employees',
      count: inactiveCount,
      icon: <CancelOutlined sx={{ fontSize: 40 }} />,
      color: 'error.main',
      bgColor: 'error.light',
    },
  ];

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={4} key={card.title}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mb: 0.5 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: card.color }}
                  >
                    {card.count}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: card.bgColor,
                    color: card.color,
                    opacity: 0.8,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
