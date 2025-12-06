import { useState, useEffect } from 'react'
import { Card, Button, Spinner, Modal, Input, Select, MatchCard } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../hooks/useAuth'
import { getResults, deleteResult, createResult, updateResult } from '../utils/api'

function Results() {
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useAuth()

  const [showAddResult, setShowAddResult] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    opponent: '',
    date: '',
    location: '',
    homeAway: 'home',
    score: '',
    opponentScore: '',
  })

  const [showEditResult, setShowEditResult] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editForm, setEditForm] = useState({
    opponent: '',
    date: '',
    location: '',
    homeAway: 'home',
    score: '',
    opponentScore: '',
  })

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const data = await getResults()
      setResults(data)

      const calculatedStats = data.reduce((acc, result) => {
        const msuScore = parseInt(result.score, 10)
        const oppScore = parseInt(result.opponentScore, 10)

        if (msuScore > oppScore) acc.wins++
        else if (msuScore < oppScore) acc.losses++
        else acc.draws++
        return acc
      }, { wins: 0, losses: 0, draws: 0 })

      setStats(calculatedStats)
    } catch (err) {
      setError('Failed to load results')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this result?')) return

    try {
      await deleteResult(id)
      await loadResults()
    } catch (err) {
      alert('Failed to delete result')
      console.error(err)
    }
  }

  const resetForm = () => {
    setForm({
      opponent: '',
      date: '',
      location: '',
      homeAway: 'home',
      score: '',
      opponentScore: '',
    })
  }

  const handleCreateResult = async () => {
    if (!form.opponent || !form.date || !form.location || form.score === '' || form.opponentScore === '') {
      alert('Opponent, Date, Location, and both Scores are required')
      return
    }

    const msuScore = parseInt(form.score, 10)
    const oppScore = parseInt(form.opponentScore, 10)
    if (isNaN(msuScore) || isNaN(oppScore)) {
      alert('Scores must be valid numbers')
      return
    }

    try {
      setSaving(true)
      const payload = {
        ...form,
        date: new Date(form.date).toISOString(),
        score: msuScore,
        opponentScore: oppScore,
        isCompleted: true,
      }

      await createResult(payload)

      await loadResults()

      setShowAddResult(false)
      resetForm()
    } catch (err) {
      alert(err.message || 'Failed to create result')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const resetEditForm = () => {
    setEditingId(null)
    setEditForm({
      opponent: '',
      date: '',
      location: '',
      homeAway: 'home',
      score: '',
      opponentScore: '',
    })
  }

  const startEditResult = (result) => {
    setEditingId(result._id)
    setEditForm({
      opponent: result.opponent || '',
      date: result.date ? new Date(result.date).toISOString().split('T')[0] : '',
      location: result.location || '',
      homeAway: result.homeAway || 'home',
      score: result.score.toString() || '',
      opponentScore: result.opponentScore.toString() || '',
    })
    setShowEditResult(true)
  }

  const handleUpdateResult = async () => {
    if (!editForm.opponent || !editForm.date || !editForm.location || editForm.score === '' || editForm.opponentScore === '' || !editingId) {
      alert('Opponent, Date, Location, and both Scores are required')
      return
    }

    const msuScore = parseInt(editForm.score, 10)
    const oppScore = parseInt(editForm.opponentScore, 10)
    if (isNaN(msuScore) || isNaN(oppScore)) {
      alert('Scores must be valid numbers')
      return
    }

    try {
      setSavingEdit(true)
      const payload = {
        ...editForm,
        date: new Date(editForm.date).toISOString(),
        score: msuScore,
        opponentScore: oppScore,
        isCompleted: true,
      }

      const updated = await updateResult(editingId, payload)

      setResults(prev => prev.map(r => r._id === editingId ? updated : r))

      await loadResults()

      setShowEditResult(false)
      resetEditForm()
    } catch (err) {
      alert(err.message || 'Failed to update result')
      console.error(err)
    } finally {
      setSavingEdit(false)
    }
  }


  if (loading) {
    return <div className="flex justify-center py-12"><Spinner label="Loading results..." /></div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Results</h1>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddResult(true)}>Add Result</Button>
        )}
      </div>

      {/* Season Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Season Statistics</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card colorScheme="gold" variant="outlined">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.wins}</div>
              <div className="text-gray-600">Wins</div>
            </div>
          </Card>
          <Card colorScheme="gold" variant="outlined">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.losses}</div>
              <div className="text-gray-600">Losses</div>
            </div>
          </Card>
          <Card colorScheme="gold" variant="outlined">
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.draws}</div>
              <div className="text-gray-600">Draws</div>
            </div>
          </Card>
        </div>
      </section>

      ---

      {/* Results List */}
      <section>
        <h2 className="text-xl font-bold mb-4">Recent Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-500">No results yet.</p>
        ) : (
          <div className="space-y-4">
            {results.map(game => {
              const isHome = game.homeAway === 'home';
              const msuScore = game.score;
              const oppScore = game.opponentScore;

              return (
                <div key={game._id} className="relative">
                  <MatchCard
                    homeTeam={isHome ? 'Montana State' : game.opponent}
                    awayTeam={isHome ? game.opponent : 'Montana State'}
                    date={new Date(game.date).toLocaleDateString()}
                    time={game.time}
                    location={game.location}
                    status="completed"
                    homeScore={isHome ? msuScore : oppScore}
                    awayScore={isHome ? oppScore : msuScore}
                    colorScheme="gold"
                  />

                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => startEditResult(game)}
                      >
                        Edit
                      </Button>
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
              )
            })}
          </div>
        )}
      </section>


      {/* Add Result Modal */}
      {isAdmin && (
        <Modal
          isOpen={showAddResult}
          onClose={() => { if (!saving) { setShowAddResult(false); resetForm() } }}
          title="Add New Game Result"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { if (!saving) { setShowAddResult(false); resetForm() } }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateResult} disabled={saving}>
                {saving ? 'Saving...' : 'Save Result'}
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
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Montana State Score"
                type="number"
                placeholder="e.g., 3"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
              />
              <Input
                label="Opponent Score"
                type="number"
                placeholder="e.g., 1"
                value={form.opponentScore}
                onChange={(e) => setForm({ ...form, opponentScore: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Result Modal */}
      {isAdmin && (
        <Modal
          isOpen={showEditResult}
          onClose={() => { if (!savingEdit) { setShowEditResult(false); resetEditForm() } }}
          title="Edit Game Result"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { if (!savingEdit) { setShowEditResult(false); resetEditForm() } }}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdateResult} disabled={savingEdit}>
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Opponent Name"
              placeholder="e.g., Carroll College"
              value={editForm.opponent}
              onChange={(e) => setEditForm({ ...editForm, opponent: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            />
            <Input
              label="Location"
              placeholder="e.g., Bobcat Stadium"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            />
            <Select
              label="Home or Away"
              value={editForm.homeAway}
              onChange={(e) => setEditForm({ ...editForm, homeAway: e.target.value })}
            >
              <option value="home">Home</option>
              <option value="away">Away</option>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Montana State Score"
                type="number"
                placeholder="e.g., 3"
                value={editForm.score}
                onChange={(e) => setEditForm({ ...editForm, score: e.target.value })}
              />
              <Input
                label="Opponent Score"
                type="number"
                placeholder="e.g., 1"
                value={editForm.opponentScore}
                onChange={(e) => setEditForm({ ...editForm, opponentScore: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}

export default Results