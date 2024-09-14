import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';

const theme = createTheme({
  // You can customize your theme here
});

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    navigate('/admin');
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/admin" element={
            <>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Portfolio Admin Panel
                  </Typography>
                </Toolbar>
              </AppBar>
              <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Login />
              </Container>
            </>
          } />
          <Route path="/dashboard" element={
            <>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Portfolio Admin Panel
                  </Typography>
                  <LogoutButton />
                </Toolbar>
              </AppBar>
              <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Dashboard />
              </Container>
            </>
          } />
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
