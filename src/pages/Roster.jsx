import { useState, useEffect } from 'react'
import { Card, PlayerCard, Button, Spinner, Modal, Input, Select } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../hooks/useAuth'
import { getPlayers, deletePlayer, createPlayer, uploadImage } from '../utils/api'

function Roster() {
  const [players, setPlayers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [form, setForm] = useState({
    name: '',
    position: '',
    number: '',
    year: '',
    imageUrl: ''
  })
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadRoster()
  }, [])

  const loadRoster = async () => {
    try {
      setLoading(true)
      const data = await getPlayers()
      // API returns array of roster members, separate by isCoach
      const coachList = data.filter(member => member.isCoach)
      const playerList = data.filter(member => !member.isCoach)
      setCoaches(coachList)
      setPlayers(playerList)
    } catch (err) {
      setError('Failed to load roster')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlayer = async (id) => {
    if (!confirm('Are you sure you want to remove this player?')) return
    
    try {
      await deletePlayer(id)
      setPlayers(players.filter(p => p._id !== id))
    } catch (err) {
      alert('Failed to delete player')
      console.error(err)
    }
  }

  const resetForm = () => {
    setForm({ name: '', position: '', number: '', year: '', imageUrl: '' })
    setUploadError('')
  }

  const handleCreatePlayer = async () => {
    if (!form.name || !form.position) {
      alert('Name and position are required')
      return
    }
    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        position: form.position.trim(),
        number: form.number !== '' ? Number(form.number) : undefined,
        year: form.year || undefined,
        imageUrl: form.imageUrl || undefined,
        isCoach: false
      }
      const created = await createPlayer(payload)
      setPlayers(prev => [created, ...prev])
      setShowAddPlayer(false)
      resetForm()
    } catch (err) {
      alert(err.message || 'Failed to create player')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError('')
    try {
      setUploading(true)
      const { url } = await uploadImage(file)
      setForm((prev) => ({ ...prev, imageUrl: url }))
    } catch (err) {
      setUploadError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner label="Loading roster..." /></div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Roster</h1>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddPlayer(true)}>Add Player</Button>
        )}
      </div>

      {/* Coaching Staff */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Coaching Staff</h2>
          {isAdmin && (
            <Button variant="outlined" size="sm">Add Coach</Button>
          )}
        </div>
        {coaches.length === 0 ? (
          <p className="text-gray-500">No coaches listed yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {coaches.map(coach => (
              <Card key={coach._id} colorScheme="gold" variant="outlined">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{coach.name}</h3>
                    <p className="text-gray-600">{coach.position}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button variant="outlined" size="sm">Edit</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Players */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Players</h2>
        {players.length === 0 ? (
          <p className="text-gray-500">No players listed yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <div key={player._id} className="relative">
                <PlayerCard
                  colorScheme="gold"
                  variant="secondary"
                  name={player.name}
                  number={player.number}
                  position={player.position}
                  image={player.imageUrl}
                  subtitle={player.year}
                />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button variant="outlined" size="sm">Edit</Button>
                    <Button 
                      variant="outlined" 
                      size="sm"
                      onClick={() => handleDeletePlayer(player._id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Player Modal */}
      {isAdmin && (
        <Modal
          isOpen={showAddPlayer}
          onClose={() => { if (!saving) { setShowAddPlayer(false); resetForm() } }}
          title="Add Player"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => { if (!saving) { setShowAddPlayer(false); resetForm() } }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreatePlayer} disabled={saving}>
                {saving ? 'Saving...' : 'Save Player'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Name"
              placeholder="Player name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Select
              label="Position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            >
              <option value="">Select position</option>
              <option value="GK">Goalkeeper (GK)</option>
              <option value="D">Defender (D)</option>
              <option value="M">Midfielder (M)</option>
              <option value="F">Forward (F)</option>
            </Select>
            <Input
              label="Number"
              type="number"
              placeholder="e.g., 10"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
            <Select
              label="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            >
              <option value="">Select year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </Select>
              <div className="space-y-2">
                <Input
                  label="Upload Photo (optional)"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                />
                {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                <Input
                  label="Or Image URL"
                  type="url"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
                {form.imageUrl && (
                  <div className="mt-2">
                    <img src={form.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded" />
                  </div>
                )}
              </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Roster
