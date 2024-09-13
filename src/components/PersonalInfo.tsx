import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Chip, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../api';
import { PersonalInformation, SocialMediaLink } from '../types';  // Import from types file

const PersonalInfo: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    name: '',
    surname: '',
    job: '',
    summary: '',
    biography: '',
    skills: [],
    socialMediaLinks: [],
    personalImageUrl: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [newSocialMediaLink, setNewSocialMediaLink] = useState<SocialMediaLink>({ logo: '', url: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isNewInfo, setIsNewInfo] = useState(false);

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getPersonalInformation();
      setPersonalInfo(data);
      setIsNewInfo(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'Personal information not found') {
        setIsNewInfo(true);
      } else {
        setError('Failed to fetch personal information');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setPersonalInfo(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setPersonalInfo(prev => ({ ...prev, skills: prev.skills.filter(skill => skill !== skillToRemove) }));
  };

  const handleAddSocialMediaLink = () => {
    if (newSocialMediaLink.logo && newSocialMediaLink.url) {
      setPersonalInfo(prev => ({ ...prev, socialMediaLinks: [...prev.socialMediaLinks, newSocialMediaLink] }));
      setNewSocialMediaLink({ logo: '', url: '' });
    }
  };

  const handleRemoveSocialMediaLink = (index: number) => {
    setPersonalInfo(prev => ({
      ...prev,
      socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isNewInfo) {
        await api.createPersonalInformation(personalInfo);
        setSuccessMessage('Personal information created successfully');
        setIsNewInfo(false);
      } else {
        await api.updatePersonalInformation(personalInfo);
        setSuccessMessage('Personal information updated successfully');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to save personal information');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {isNewInfo ? 'Create Personal Information' : 'Update Personal Information'}
      </Typography>
      
      <TextField fullWidth margin="normal" name="name" label="Name" value={personalInfo.name} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" name="surname" label="Surname" value={personalInfo.surname} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" name="job" label="Job" value={personalInfo.job} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" name="summary" label="Summary" multiline rows={3} value={personalInfo.summary} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" name="biography" label="Biography" multiline rows={5} value={personalInfo.biography} onChange={handleInputChange} />
      <TextField fullWidth margin="normal" name="personalImageUrl" label="Personal Image URL" value={personalInfo.personalImageUrl} onChange={handleInputChange} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Skills</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            label="New Skill"
            size="small"
          />
          <IconButton onClick={handleAddSkill}><AddIcon /></IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {personalInfo.skills.map((skill, index) => (
            <Chip key={index} label={skill} onDelete={() => handleRemoveSkill(skill)} />
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Social Media Links</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            value={newSocialMediaLink.logo}
            onChange={(e) => setNewSocialMediaLink(prev => ({ ...prev, logo: e.target.value }))}
            label="Logo"
            size="small"
            sx={{ mr: 1 }}
          />
          <TextField
            value={newSocialMediaLink.url}
            onChange={(e) => setNewSocialMediaLink(prev => ({ ...prev, url: e.target.value }))}
            label="URL"
            size="small"
          />
          <IconButton onClick={handleAddSocialMediaLink}><AddIcon /></IconButton>
        </Box>
        {personalInfo.socialMediaLinks.map((link, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography>{link.logo}: {link.url}</Typography>
            <IconButton onClick={() => handleRemoveSocialMediaLink(index)}><DeleteIcon /></IconButton>
          </Box>
        ))}
      </Box>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={isLoading}>
        {isLoading ? 'Saving...' : (isNewInfo ? 'Create Personal Information' : 'Update Personal Information')}
      </Button>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalInfo;