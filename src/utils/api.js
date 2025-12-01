// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// API utility functions
export const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Network response was not ok')
    return response.json()
  },

  // Add more methods as needed (PUT, DELETE, etc.)
}

// Example API calls
export const getSchedule = () => api.get('/schedule')
export const getRoster = () => api.get('/roster')
export const getResults = () => api.get('/results')
