import { useState, useEffect } from 'react'
import { Card, Button, Spinner } from '@montana-state-club-soccer/mscss'
import { useAuth } from '../hooks/useAuth'
import { getResults, deleteResult } from '../utils/api'

function Results() {
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const data = await getResults()
      setResults(data)
      
      // Calculate stats from results
      const calculatedStats = data.reduce((acc, result) => {
        if (result.score > result.opponentScore) acc.wins++
        else if (result.score < result.opponentScore) acc.losses++
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
      await loadResults() // Reload to recalculate stats
    } catch (err) {
      alert('Failed to delete result')
      console.error(err)
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
          <Button variant="primary">Add Result</Button>
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

      {/* Results List */}
      <section>
        <h2 className="text-xl font-bold mb-4">Recent Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-500">No results yet.</p>
        ) : (
          <div className="space-y-4">
            {results.map(game => (
              <Card key={game._id} colorScheme="gold" variant="outlined">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">vs {game.opponent}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${
                        game.score > game.opponentScore ? 'bg-green-100 text-green-800' :
                        game.score < game.opponentScore ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {game.score > game.opponentScore ? 'WIN' : game.score < game.opponentScore ? 'LOSS' : 'DRAW'}
                      </span>
                    </div>
                    <div className="text-gray-600">
                      <p className="font-medium">{new Date(game.date).toLocaleDateString()}</p>
                      <p className="text-sm">{game.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#003865]">{game.score} - {game.opponentScore}</div>
                      <div className="text-sm text-gray-500">Final Score</div>
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Results
