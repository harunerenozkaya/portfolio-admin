import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Container, Grid, Avatar, Link, IconButton, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { GitHub, LinkedIn, Twitter, Email, Facebook, Instagram, YouTube } from '@mui/icons-material';
import { PersonalInformation, Experience, Project } from '../types';
import { api } from '../api';
import { Helmet } from 'react-helmet';

const formatDate = (dateString: string) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

const Portfolio: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const aboutRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

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

  const iconProps = { sx: { fontSize: 32 } };

  const getSocialIcon = (logo: string): React.ReactElement | null => {
    switch (logo.toLowerCase()) {
      case 'github': return <GitHub {...iconProps} />;
      case 'linkedin': return <LinkedIn {...iconProps} />;
      case 'twitter': return <Twitter {...iconProps} />;
      case 'email': return <Email {...iconProps} />;
      case 'facebook': return <Facebook {...iconProps} />;
      case 'instagram': return <Instagram {...iconProps} />;
      case 'youtube': return <YouTube {...iconProps} />;
      default: return null;
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pageTitle = `${personalInfo.name} ${personalInfo.surname} - ${personalInfo.job}`;

  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', color: '#000000', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      
      {/* Header */}
      <Box sx={{ bgcolor: '#000000' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', py: 1 }}>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#fff', mb: { xs: 2, sm: 0 }, fontWeight: 'bold' }}>
              {personalInfo?.name} {personalInfo?.surname}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link component="button" variant="h6" onClick={() => scrollToSection(aboutRef)} sx={{ color: '#fff' }} underline="none">
                About
              </Link>
              <Link component="button" variant="h6" onClick={() => scrollToSection(experienceRef)} sx={{ color: '#fff' }} underline="none">
                Work Experience
              </Link>
              <Link component="button" variant="h6" onClick={() => scrollToSection(projectsRef)} sx={{ color: '#fff' }} underline="none">
                Projects
              </Link>
              <Link href="https://medium.com" target="_blank" rel="noopener noreferrer" variant="h6" sx={{ color: '#fff' }} underline="none">
                Blog
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </Box>

      {/* Adjust top padding to account for the smaller header */}
      <Box sx={{ pt: 8 }} />

      {/* Hero Section */}
      <Box sx={{ color: 'black', py: 4}}>
        <Container maxWidth="lg">
          <Grid container spacing={0} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Grid item xs={12} md={5} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Avatar
                src={personalInfo.personalImageUrl}
                alt={`${personalInfo.name} ${personalInfo.surname}`}
                sx={{
                  width: { xs: 250, md: 350 },
                  height: { xs: 250, md: 350 },
                  mx: 'auto',
                  borderRadius: '16px',
                  objectFit: 'cover'
                }}
                variant="rounded"
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 'bold',
                  width: { xs: '100%', md: '75%' },
                  whiteSpace: 'pre-wrap'
                }} 
                color="black"
              >
                {personalInfo.summary}
              </Typography>
              <Box>
                {personalInfo.socialMediaLinks.map((link, index) => (
                  link.url && link.url.trim() !== '' && (
                    <IconButton 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      sx={{ color: 'black', mr: 2, p: 0.5 }}
                    >
                      {getSocialIcon(link.logo) || (
                        <Box 
                          component="img"
                          src={link.logo}
                          alt={`${link.url} icon`}
                          sx={{ 
                            width: iconProps.sx.fontSize, 
                            height: iconProps.sx.fontSize, 
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </IconButton>
                  )
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8, flexGrow: 1 }}>
        {/* About Section */}
        <Box ref={aboutRef} sx={{ mb: 12 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            About
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Get to know me
              </Typography>
              <Typography 
                variant="h6" 
                paragraph 
                sx={{ 
                  width: '75%',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {personalInfo.biography}
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ pl: { md: 4 } }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[0, 1].map((columnIndex) => (
                    <List key={columnIndex} dense sx={{ width: '50%', m: 0 }}>
                      {personalInfo.skills
                        .slice(
                          columnIndex * Math.ceil(personalInfo.skills.length / 2),
                          (columnIndex + 1) * Math.ceil(personalInfo.skills.length / 2)
                        )
                        .map((skill, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemText 
                              primary={skill} 
                              primaryTypographyProps={{ 
                                variant: 'h6',
                                sx: { '&::before': { content: '"•"', marginRight: 1 } }
                              }} 
                            />
                          </ListItem>
                        ))}
                    </List>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Experiences Section */}
        <Box ref={experienceRef} sx={{ mb: 12 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            Experience
          </Typography>
          <Box sx={{ height: '10px' }} />
          <Grid container spacing={0}>
            {experiences.map((experience) => (
              <Grid item xs={12} key={experience.id}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 3, flexShrink: 0 }}>
                    <Avatar
                      src={experience.companyLogo}
                      alt={`${experience.companyName} logo`}
                      sx={{
                        width: 200,
                        height: 200,
                        objectFit: 'contain',
                        borderRadius: '32px'  // This adds rounded corners
                      }}
                      variant="rounded"  // Changed from "square" to "rounded"
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight="bold">{experience.role}</Typography>
                    <Typography variant="h6" color="text.secondary">
                      {experience.companyName}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {formatDate(experience.startDate ?? '')} - {formatDate(experience.endDate ?? '')}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2 }}>{experience.detail}</Typography>
                    <Typography variant="h6">
                      Skills: {experience.usedSkills.join(', ')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Projects Section */}
        <Box ref={projectsRef}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
            Projects
          </Typography>
          <Box sx={{ height: '10px' }} />
          <Grid container spacing={0}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ mr: 3, flexShrink: 0 }}>
                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                      <Avatar
                        src={project.logoUrl}
                        alt={`${project.name} image`}
                        sx={{
                          width: 200,
                          height: 200,
                          objectFit: 'contain',
                          borderRadius: '32px',
                          cursor: 'pointer'
                        }}
                        variant="rounded"
                      />
                    </Link>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Link href={project.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'inherit', textDecoration: 'none' }}>
                      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ cursor: 'pointer' }}>
                        {project.name}
                      </Typography>
                    </Link>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {project.detail}
                    </Typography>
                    <Typography variant="h6">
                      Skills: {project.skills.join(', ')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'black', 
          color: 'white', 
          py: 3,
          mt: 'auto'  // This pushes the footer to the bottom
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {currentYear} {personalInfo?.name} {personalInfo?.surname}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Portfolio;