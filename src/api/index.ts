import { PersonalInformation, Experience, Project } from '../types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const getAuthHeader = () => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');
  return `Basic ${btoa(`${username}:${password}`)}`;
};

export const api = {
  async getPersonalInformation(): Promise<PersonalInformation> {
    const response = await fetch(`${BASE_URL}/personal-information`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Personal information not found');
      }
      throw new Error('Failed to fetch personal information');
    }
    return response.json();
  },

  async createPersonalInformation(data: PersonalInformation): Promise<void> {
    const response = await fetch(`${BASE_URL}/personal-information`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create personal information');
    }
  },

  async updatePersonalInformation(data: PersonalInformation): Promise<void> {
    const response = await fetch(`${BASE_URL}/personal-information`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update personal information');
    }
  },

  async getExperiences(): Promise<Experience[]> {
    const response = await fetch(`${BASE_URL}/experience`);
    if (!response.ok) {
      throw new Error('Failed to fetch experiences');
    }
    return response.json();
  },

  async createExperience(data: Omit<Experience, 'id'>): Promise<Experience> {
    const response = await fetch(`${BASE_URL}/experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create experience');
    }
    return response.json();
  },

  async updateExperience(id: number, data: Omit<Experience, 'id'>): Promise<Experience> {
    const response = await fetch(`${BASE_URL}/experience/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update experience');
    }
    return response.json();
  },

  async deleteExperience(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/experience/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete experience');
    }
  },

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${BASE_URL}/project`);
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  async createProject(data: Omit<Project, 'id'>): Promise<Project> {
    const response = await fetch(`${BASE_URL}/project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },

  async updateProject(id: number, data: Omit<Project, 'id'>): Promise<Project> {
    const response = await fetch(`${BASE_URL}/project/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  },

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/project/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': getAuthHeader(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
  },
};

// Update these functions to use the api object methods
export const getExperiences = api.getExperiences;
export const addExperience = api.createExperience;
export const updateExperience = api.updateExperience;
export const deleteExperience = api.deleteExperience;

// Add these exports at the end of the file
export const getProjects = api.getProjects;
export const addProject = api.createProject;
export const updateProject = api.updateProject;
export const deleteProject = api.deleteProject;