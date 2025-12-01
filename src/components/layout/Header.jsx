import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../../hooks/useAuth'

function Header() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-[#003865] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="text-2xl font-bold">
              <span className="text-[#FFC72C]">MSCS</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold">Montana State</div>
              <div className="text-xs">Club Soccer</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[#FFC72C] transition-colors">
              Home
            </Link>
            <Link to="/schedule" className="hover:text-[#FFC72C] transition-colors">
              Schedule
            </Link>
            <Link to="/roster" className="hover:text-[#FFC72C] transition-colors">
              Roster
            </Link>
            <Link to="/results" className="hover:text-[#FFC72C] transition-colors">
              Results
            </Link>
            <Link to="/about" className="hover:text-[#FFC72C] transition-colors">
              About
            </Link>
          </nav>

          {/* Auth / CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:text-[#FFC72C] transition-colors">
                  Login
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open('https://catsconnect.montana.edu/organization/msuclubsoccer', '_blank', 'noreferrer')}
                >
                  Join the Team
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm opacity-90">{user?.name || user?.email}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded hover:bg-[#003865]/80">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
