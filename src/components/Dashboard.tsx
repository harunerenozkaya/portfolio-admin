import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import Experiences from './Experiences';
import Projects from './Projects';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/admin/personal-info">Personal Info</Link></li>
          <li><Link to="/admin/experiences">Experiences</Link></li>
          <li><Link to="/admin/projects">Projects</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="personal-info" element={<PersonalInfo />} />
        <Route path="experiences" element={<Experiences />} />
        <Route path="projects" element={<Projects />} />
      </Routes>
    </div>
  );
};

export default Dashboard;