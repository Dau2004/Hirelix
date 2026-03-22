import client from './client';

export const submitApplication = (formData) =>
  client.post('/api/applications/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const myApplications = () => client.get('/api/applications/mine/');
export const getApplication = (id) => client.get(`/api/applications/${id}/`);
export const updateApplicationStatus = (id, status) => client.patch(`/api/applications/${id}/status/`, { status });
