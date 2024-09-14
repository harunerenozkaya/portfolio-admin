import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import PersonalInfo from './PersonalInfo';
import Experiences from './Experiences';
import Projects from './Projects';
import { api } from '../api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        await api.getPersonalInformation();
        console.log("Authentication successful");
        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        if (error instanceof Error && error.message === 'Personal information not found') {
          console.log("Personal information not found, but user is authenticated");
          setLoading(false);
        } else {
          setError('Authentication failed. Please log in again.');
          setLoading(false);
          navigate('/admin');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>Dashboard</Typography>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Personal Information" />
            <Tab label="Experiences" />
            <Tab label="Projects" />
          </Tabs>
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && <PersonalInfo />}
            {activeTab === 1 && <Experiences />}
            {activeTab === 2 && <Projects />}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;