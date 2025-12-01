import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Spinner } from '@montana-state-club-soccer/mscss'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
