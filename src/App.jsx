import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RoleGuard } from './components/auth/RoleGuard'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Roster from './pages/Roster'
import Results from './pages/Results'
import About from './pages/About'
import Login from './pages/Login'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/roster" element={<Roster />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes - require authentication */}
            {/* <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            /> */}

            {/* Admin-only routes */}
            {/* <Route 
              path="/admin" 
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminPanel />
                </RoleGuard>
              } 
            /> */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
