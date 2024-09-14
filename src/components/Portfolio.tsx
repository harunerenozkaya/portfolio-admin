import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Grid, Card, CardContent, Chip, Avatar, Link } from '@mui/material';
import { PersonalInformation, Experience, Project } from '../types';
import { api } from '../api';

const Portfolio: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personalData, experiencesData, projectsData] = await Promise.all([
          api.getPersonalInformation(),
          api.getExperiences(),
          api.getProjects()
        ]);
        setPersonalInfo(personalData);
        setExperiences(experiencesData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };
    fetchData();
  }, []);

  if (!personalInfo) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Personal Information */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Avatar
          src={personalInfo.personalImageUrl}
          alt={`${personalInfo.name} ${personalInfo.surname}`}
          sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
        />
        <Typography variant="h3" gutterBottom>
          {personalInfo.name} {personalInfo.surname}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {personalInfo.job}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {personalInfo.summary}
        </Typography>
        <Box sx={{ mb: 2 }}>
          {personalInfo.skills.map((skill, index) => (
            <Chip key={index} label={skill} sx={{ m: 0.5 }} />
          ))}
        </Box>
        <Box>
          {personalInfo.socialMediaLinks.map((link, index) => (
            <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer" sx={{ mx: 1 }}>
              {link.logo}
            </Link>
          ))}
        </Box>
      </Box>

      {/* Experiences */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Experience
        </Typography>
        <Grid container spacing={4}>
          {experiences.map((experience) => (
            <Grid item xs={12} md={6} key={experience.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{experience.role}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {experience.companyName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {experience.startDate} - {experience.endDate || 'Present'}
                  </Typography>
                  <Typography variant="body2">{experience.detail}</Typography>
                  <Box sx={{ mt: 2 }}>
                    {experience.usedSkills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Projects */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Projects
        </Typography>
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.detail}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {project.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                  <Link href={project.url} target="_blank" rel="noopener noreferrer">
                    View Project
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Portfolio;