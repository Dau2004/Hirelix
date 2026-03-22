import client from './client';

export const listJobs = () => client.get('/api/jobs/');
export const getJob = (id) => client.get(`/api/jobs/${id}/`);
export const createJob = (data) => client.post('/api/jobs/', data);
export const updateJob = (id, data) => client.patch(`/api/jobs/${id}/`, data);
export const jobRankings = (id) => client.get(`/api/jobs/${id}/rankings/`);
export const deleteJob = (id) => client.delete(`/api/jobs/${id}/`);
