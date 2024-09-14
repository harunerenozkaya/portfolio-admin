import React, { useState, useEffect } from 'react';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '../api';
import { Experience } from '../types';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Box,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Experiences: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    companyName: '',
    companyLogo: '',
    role: '',
    startDate: '',
    endDate: '',
    detail: '',
    usedSkills: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      console.log("Fetching experiences...");
      const data = await getExperiences();
      console.log("Experiences fetched:", data);
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsInput = e.target.value;
    setFormData(prevData => ({ ...prevData, usedSkills: skillsInput ? [skillsInput] : [] }));
  };

  const handleSkillsBlur = () => {
    setFormData(prevData => ({
      ...prevData,
      usedSkills: prevData.usedSkills.length > 0
        ? prevData.usedSkills[0]
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill !== '')
        : []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSkillsBlur(); // Process skills before submitting
    try {
      if (editingId) {
        await updateExperience(editingId, formData);
      } else {
        await addExperience(formData);
      }
      fetchExperiences();
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      ...experience,
      usedSkills: [...experience.usedSkills], // Create a new array to avoid mutating the original
    });
    setEditingId(experience.id);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id: number) => {
    setExperienceToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (experienceToDelete !== null) {
      try {
        await deleteExperience(experienceToDelete);
        fetchExperiences();
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setExperienceToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setExperienceToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      companyLogo: '',
      role: '',
      startDate: '',
      endDate: '',
      detail: '',
      usedSkills: [],
    });
    setEditingId(null);
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    return `${startDate} - ${endDate || 'Present'}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Experiences
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Experience
      </Button>

      <Grid container spacing={3}>
        {experiences.map((experience) => (
          <Grid item xs={12} sm={6} md={4} key={experience.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{experience.companyName}</Typography>
                <Typography variant="subtitle1">{experience.role}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateRange(experience.startDate, experience.endDate)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {experience.detail}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {experience.usedSkills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(experience)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(experience.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="companyName"
              label="Company Name"
              value={formData.companyName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="companyLogo"
              label="Company Logo URL"
              value={formData.companyLogo}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="endDate"
              label="End Date (leave blank for ongoing)"
              type="date"
              value={formData.endDate || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              name="detail"
              label="Experience Details"
              multiline
              rows={4}
              value={formData.detail}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="usedSkills"
              label="Used Skills (comma-separated)"
              value={formData.usedSkills.length > 0 ? formData.usedSkills.join(', ') : ''}
              onChange={handleSkillsChange}
              onBlur={handleSkillsBlur}
              helperText="Add skills separated by commas. Press Enter or click outside the field to confirm."
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this experience?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Experiences;