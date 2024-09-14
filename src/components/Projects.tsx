import React, { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../api';
import { Project } from '../types';
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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    detail: '',
    skills: [],
    logoUrl: '',
    url: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await addProject(formData);
      }
      fetchProjects();
      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id);
    setOpenDialog(true);
  };

  const handleDeleteClick = (id: number) => {
    setProjectToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete !== null) {
      try {
        await deleteProject(projectToDelete);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
    setDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      detail: '',
      skills: [],
      logoUrl: '',
      url: '',
    });
    setEditingId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 2 }}
      >
        Add Project
      </Button>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {project.detail}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {project.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Logo URL: {project.logoUrl}
                </Typography>
                <Typography variant="body2">
                  Project URL: <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(project.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingId ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="detail"
              label="Project Details"
              multiline
              rows={4}
              value={formData.detail}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="skills"
              label="Skills (comma-separated)"
              value={formData.skills.join(', ')}
              onChange={handleSkillsChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="logoUrl"
              label="Logo URL"
              value={formData.logoUrl}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="url"
              label="Project URL"
              value={formData.url}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Are you sure you want to delete this project?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;