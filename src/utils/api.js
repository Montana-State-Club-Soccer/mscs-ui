// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('API_BASE_URL configured as:', API_BASE_URL)

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// API utility functions
export const api = {
  async get(endpoint) {
    const url = `${API_BASE_URL}${endpoint}`
    console.log('GET request to:', url)
    const response = await fetch(url, {
      headers: getAuthHeaders()
    })
    console.log('Response status:', response.status)
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    const data = await response.json()
    console.log('Response data:', data)
    return data
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return response.json()
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return response.json()
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return response.json()
  }
}

// Schedule API calls
export const getSchedule = () => api.get('/schedule')
export const createGame = (data) => api.post('/schedule', data)
export const updateGame = (id, data) => api.put(`/schedule/${id}`, data)
export const deleteGame = (id) => api.delete(`/schedule/${id}`)

// Roster API calls
export const getRoster = () => api.get('/roster')
export const getPlayers = () => api.get('/roster') // Alias for getRoster
export const createPlayer = (data) => api.post('/roster', data)
export const updatePlayer = (id, data) => api.put(`/roster/${id}`, data)
export const deletePlayer = (id) => api.delete(`/roster/${id}`)

// Results API calls
export const getResults = () => api.get('/results')
export const createResult = (data) => api.post('/results', data)
export const updateResult = (id, data) => api.put(`/results/${id}`, data)
export const deleteResult = (id) => api.delete(`/results/${id}`)

// Highlights API calls
export const getHighlights = () => api.get('/highlights')
export const createHighlight = (data) => api.post('/highlights', data)
export const updateHighlight = (id, data) => api.put(`/highlights/${id}`, data)
export const deleteHighlight = (id) => api.delete(`/highlights/${id}`)

// Event API calls
export const getEvents = () => api.get('/events')
export const createEvent = (data) => api.post('/events', data)
export const updateEvent = (id, data) => api.put(`/events/${id}`, data)
export const deleteEvent = (id) => api.delete(`/events/${id}`)

// Uploads
export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    // Do NOT set Content-Type for multipart; browser will set boundary
    headers: (() => {
      const token = localStorage.getItem('token')
      return token ? { 'Authorization': `Bearer ${token}` } : {}
    })(),
    body: formData
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return response.json() // { url }
}

