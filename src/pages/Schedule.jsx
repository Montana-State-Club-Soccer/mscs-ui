import { useState, useEffect } from 'react'
import { Card, Button, Spinner } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../hooks/useAuth'
import { getSchedule, deleteGame } from '../utils/api'

function Schedule() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
          <Button variant="primary">Add Game</Button>
        )}
      </div>

      {games.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No games scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {games.map(game => (
            <Card key={game._id} colorScheme="gold" variant="outlined">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">vs {game.opponent}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      game.homeAway === 'home' 
                        ? 'bg-[#003865] text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {game.homeAway?.toUpperCase()}
                    </span>
                    {!game.isCompleted && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FFC72C] text-[#003865]">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    <p className="font-medium">{new Date(game.date).toLocaleDateString()} at {game.time}</p>
                    <p className="text-sm">{game.location}</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="flex gap-2">
                    <Button variant="outlined" size="sm">Edit</Button>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Schedule
