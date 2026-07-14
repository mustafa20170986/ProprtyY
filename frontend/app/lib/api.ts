import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:4000/api',
});

export const syncUser = async (clerkId: string, email: string, name: string) => {
  const res = await api.post('/auth/sync', { clerkId, email, name });
  return res.data;
};

export const fetchProperties = async (params: any = {}) => {
  const res = await api.get('/properties', { params });
  return res.data;
};

export const fetchProperty = async (id: string) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};

export const createProperty = async (data: any, userId: string, role: string) => {
  const res = await api.post('/properties', data, { headers: { 'x-user-id': userId, 'x-user-role': role } });
  return res.data;
};

export const saveToggle = async (userId: string, propertyId: string) => {
  const res = await api.post('/saved/toggle', { userId, propertyId });
  return res.data;
};

export const createInquiry = async (data: any) => {
  const res = await api.post('/inquiries', data);
  return res.data;
};

export const applyForRole = async (data: any) => {
  const res = await api.post('/applications', data);
  return res.data;
};

export default api;
