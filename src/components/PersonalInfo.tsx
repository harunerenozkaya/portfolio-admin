import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, TextField, Button, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../api';
import { PersonalInformation, SocialMediaLink } from '../types';

const DEFAULT_SOCIAL_MEDIA = ['Email', 'Github', 'Instagram', 'YouTube', 'LinkedIn', 'Twitter', 'Facebook'];

const PersonalInfo: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<PersonalInformation | null>(null);

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      console.log("Fetching personal info...");
      const data = await api.getPersonalInformation();
      console.log("Personal info fetched:", data);

      // For each default social media link, if it doesn't exist in the data, add it
      let newSocialMediaLinks = data.socialMediaLinks;
      DEFAULT_SOCIAL_MEDIA.forEach(platform => {
        if (!newSocialMediaLinks.some(link => link.logo === platform)) {
          newSocialMediaLinks.push({ logo: platform, url: '' });
        }
      });
      // Update the data with the new social media links  
      const updatedData = { ...data, socialMediaLinks: newSocialMediaLinks };

      setPersonalInfo(updatedData);
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personal information:', error);
      if (error instanceof Error && error.message === 'Personal information not found') {
        // If 404, set editing mode to true to allow creation
        setEditing(true);
        setFormData({
          name: '',
          surname: '',
          job: '',
          summary: '',
          biography: '',
          skills: [],
          socialMediaLinks: [],
          personalImageUrl: '',
        });
      } else {
        setError('Failed to load personal information');
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => prev ? { ...prev, skills } : null);
  };

  const handleSocialMediaChange = (index: number, field: keyof SocialMediaLink, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const newSocialMediaLinks = [...prev.socialMediaLinks];
      newSocialMediaLinks[index] = { ...newSocialMediaLinks[index], [field]: value };
      return { ...prev, socialMediaLinks: newSocialMediaLinks };
    });
  };

  const handleAddSocialMedia = () => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        socialMediaLinks: [...prev.socialMediaLinks, { logo: '', url: '' }]
      };
    });
  };

  const handleRemoveSocialMedia = (index: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const newSocialMediaLinks = prev.socialMediaLinks.filter((_, i) => i !== index);
      return { ...prev, socialMediaLinks: newSocialMediaLinks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      if (personalInfo) {
        await api.updatePersonalInformation(formData);
      } else {
        await api.createPersonalInformation(formData);
      }
      setPersonalInfo(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error saving personal information:', error);
      setError('Failed to save personal information');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      {!editing ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">Name</TableCell>
                  <TableCell>{personalInfo?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Surname</TableCell>
                  <TableCell>{personalInfo?.surname}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Job</TableCell>
                  <TableCell>{personalInfo?.job}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Summary</TableCell>
                  <TableCell>{personalInfo?.summary}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Biography</TableCell>
                  <TableCell>{personalInfo?.biography}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Skills</TableCell>
                  <TableCell>
                    {personalInfo?.skills.map((skill, index) => (
                      <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Social Media</TableCell>
                  <TableCell>
                    {personalInfo?.socialMediaLinks.map((link, index) => (
                      link.url && link.url.trim() !== '' && (
                        <Typography key={index}>
                          {link.logo}: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                        </Typography>
                      )
                    ))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Personal Image URL</TableCell>
                  <TableCell>{personalInfo?.personalImageUrl}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={() => setEditing(true)} sx={{ mt: 2 }}>
            Edit Information
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData?.name || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Surname"
                name="surname"
                value={formData?.surname || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job"
                name="job"
                value={formData?.job || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Summary"
                name="summary"
                multiline
                rows={3}
                value={formData?.summary || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biography"
                name="biography"
                multiline
                rows={5}
                value={formData?.biography || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills (comma-separated)"
                name="skills"
                value={formData?.skills.join(', ') || ''}
                onChange={handleSkillsChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 , mt:2}}>Social Media Links</Typography>
              {formData?.socialMediaLinks.map((link, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label={DEFAULT_SOCIAL_MEDIA.includes(link.logo) ? link.logo : "Logo URL"}
                    value={link.logo}
                    onChange={(e) => handleSocialMediaChange(index, 'logo', e.target.value)}
                    sx={{ mr: 1, width: '50%' }}
                    InputProps={{
                      readOnly: DEFAULT_SOCIAL_MEDIA.includes(link.logo),
                    }}
                  />
                  <TextField
                    label="URL"
                    value={link.url}
                    onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  {!DEFAULT_SOCIAL_MEDIA.includes(link.logo) && (
                    <IconButton onClick={() => handleRemoveSocialMedia(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />} 
                onClick={handleAddSocialMedia}
                sx={{ mb: 2 }}
              >
                Add Social Media Link
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Personal Image</Typography>
              <TextField
                fullWidth
                label="Personal Image URL"
                name="personalImageUrl"
                value={formData?.personalImageUrl || ''}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" sx={{ mr: 1 }}>
              {personalInfo ? 'Save Changes' : 'Create Personal Information'}
            </Button>
            {personalInfo && (
              <Button variant="outlined" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </Box>
        </form>
      )}
    </Box>
  );
};

export default PersonalInfo;