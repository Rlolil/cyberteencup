import { projectId, publicAnonKey } from './supabase/info'

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e5b94f28`

export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Team APIs
export const teamApi = {
  signup: (data: any) => apiCall('/team/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getAll: () => apiCall('/teams'),
  
  getById: (id: string) => apiCall(`/team/${id}`),
}

// Admin APIs
export const adminApi = {
  signup: (data: any, token: string) => apiCall('/admin/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token),
  
  createTeam: (data: any, token: string) => apiCall('/admin/team/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token),
  
  updateTeam: (id: string, data: any, token: string) => apiCall(`/admin/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token),
  
  deleteTeam: (id: string, token: string) => apiCall(`/admin/team/${id}`, {
    method: 'DELETE',
  }, token),
  
  addMember: (teamId: string, data: any, token: string) => apiCall(`/admin/team/${teamId}/member`, {
    method: 'POST',
    body: JSON.stringify(data),
  }, token),
  
  deleteMember: (teamId: string, memberId: string, token: string) => apiCall(`/admin/team/${teamId}/member/${memberId}`, {
    method: 'DELETE',
  }, token),
  
  updateResults: (teamId: string, data: any, token: string) => apiCall(`/admin/results/${teamId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token),
  
  getMessages: (token: string) => apiCall('/admin/messages', {}, token),
  
  markMessageRead: (id: string, token: string) => apiCall(`/admin/message/${id}/read`, {
    method: 'PUT',
  }, token),
  
  getStats: (token: string) => apiCall('/admin/stats', {}, token),
}

// Results APIs
export const resultsApi = {
  getAll: () => apiCall('/results'),
}

// Contact API
export const contactApi = {
  send: (data: any) => apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
