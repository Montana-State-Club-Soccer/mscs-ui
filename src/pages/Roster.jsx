import { useState, useEffect } from 'react'
import { Card, PlayerCard, Button, Spinner } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../hooks/useAuth'
import { getPlayers, deletePlayer } from '../utils/api'

function Roster() {
  const [players, setPlayers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadRoster()
  }, [])

  const loadRoster = async () => {
    try {
      setLoading(true)
      const data = await getPlayers()
      // Assuming API returns { players: [], coaches: [] }
      setPlayers(data.players || [])
      setCoaches(data.coaches || [])
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
      setPlayers(players.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete player')
      console.error(err)
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
          <Button variant="primary">Add Player</Button>
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
              <Card key={coach.id} colorScheme="gold" variant="outlined">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{coach.name}</h3>
                    <p className="text-gray-600">{coach.role}</p>
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
              <div key={player.id} className="relative">
                <PlayerCard
                  colorScheme="gold"
                  variant="secondary"
                  name={player.name}
                  number={player.number}
                  position={player.position}
                  subtitle={player.year}
                />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button variant="outlined" size="sm">Edit</Button>
                    <Button 
                      variant="outlined" 
                      size="sm"
                      onClick={() => handleDeletePlayer(player.id)}
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
    </div>
  )
}

export default Roster
