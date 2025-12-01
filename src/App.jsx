import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import '@montana-state-club-soccer/mscss/dist/styles.css'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Roster from './pages/Roster'
import Results from './pages/Results'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
