import { useState, useEffect } from 'react'
import { Card, Button, Spinner, Modal, Input, Select, MatchCard } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../hooks/useAuth'
import { getSchedule, deleteGame, createGame, updateGame } from '../utils/api'

function Schedule() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddGame, setShowAddGame] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    opponent: '',
    date: '',
    time: '',
    location: '',
    homeAway: 'home',
    isCompleted: false,
    score: '',
  })
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      setLoading(true)
      const data = await getSchedule()
      setGames(data)
    } catch (err) {
      setError('Failed to load schedule')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this game?')) return

    try {
      await deleteGame(id)
      setGames(games.filter(g => g._id !== id))
    } catch (err) {
      alert('Failed to delete game')
      console.error(err)
    }
  }

  const resetForm = () => {
    setForm({
      opponent: '',
      date: '',
      time: '',
      location: '',
      homeAway: 'home',
      isCompleted: false,
      score: '',
    })
  }

  const handleCreateGame = async () => {
    if (!form.opponent || !form.date || !form.time || !form.location) {
      alert('Opponent, Date, Time, and Location are required')
      return
    }

    try {
      setSaving(true)
      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
        time: form.time.trim(),
        location: form.location.trim(),
        score: form.score || undefined,
        isCompleted: !!form.score,
      }
      const created = await createGame(payload)

      await loadSchedule()

      setShowAddGame(false)
      resetForm()
    } catch (err) {
      alert(err.message || 'Failed to create game')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner label="Loading schedule..." /></div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Schedule</h1>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddGame(true)}>Add Game</Button>
        )}
      </div>

      {games.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No games scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {games.map(game => (
            <div key={game._id} className="relative"> {/* Use a div wrapper for the absolute position admin buttons */}
              <MatchCard // <--- USING THE NEW COMPONENT
                homeTeam={game.homeAway === 'home' ? 'Montana State' : game.opponent}
                awayTeam={game.homeAway === 'away' ? 'Montana State' : game.opponent}
                date={new Date(game.date).toLocaleDateString()}
                time={game.time}
                location={game.location}
                status={game.isCompleted ? 'completed' : 'upcoming'}
                score={game.isCompleted ? game.score : undefined} // Pass score only if completed
                colorScheme="gold"
              />
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2"> {/* Position admin buttons over the card */}
                  <Button variant="outlined" size="sm">Edit</Button> {/* Placeholder for edit */}
                  <Button
                    variant="outlined"
                    size="sm"
                    onClick={() => handleDelete(game._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Add Game Modal */}
      {isAdmin && (
        <Modal
          isOpen={showAddGame}
          onClose={() => { if (!saving) { setShowAddGame(false); resetForm() } }}
          title="Add New Game"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { if (!saving) { setShowAddGame(false); resetForm() } }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateGame} disabled={saving}>
                {saving ? 'Saving...' : 'Save Game'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Opponent Name"
              placeholder="e.g., Carroll College"
              value={form.opponent}
              onChange={(e) => setForm({ ...form, opponent: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <Input
                label="Time"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <Input
              label="Location"
              placeholder="e.g., Bobcat Stadium"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Select
              label="Home or Away"
              value={form.homeAway}
              onChange={(e) => setForm({ ...form, homeAway: e.target.value })}
            >
              <option value="home">Home</option>
              <option value="away">Away</option>
            </Select>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Schedule
