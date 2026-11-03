import client from './client';

export const categoryApi = {
  // Public
  getCategories: (params) => client.get('/categories', { params }),
  getCategoryDetail: (id) => client.get(`/categories/${id}`),

  // Admin / Staff
  adminCreateCategory: (data) => client.post('/categories', data),
  adminUpdateCategory: (id, data) => client.put(`/categories/${id}`, data),
  adminDeleteCategory: (id) => client.delete(`/categories/${id}`),
};
