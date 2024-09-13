import { PersonalInformation } from '../types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const api = {
  async getPersonalInformation(): Promise<PersonalInformation> {
    const response = await fetch(`${BASE_URL}/personal-information`, {
      headers: {
        'Authorization': `Basic ${btoa(`${localStorage.getItem('username')}:${localStorage.getItem('password')}`)}`,
      },
    });
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
        'Authorization': `Basic ${btoa(`${localStorage.getItem('username')}:${localStorage.getItem('password')}`)}`,
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
        'Authorization': `Basic ${btoa(`${localStorage.getItem('username')}:${localStorage.getItem('password')}`)}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update personal information');
    }
  },

  // Add other API methods as needed
};