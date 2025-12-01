import { PlayerCard, MatchCard } from '@montana-state-club-soccer/mscss'
import PlayerImage from '../images/team.jpg';

function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Welcome to Montana State Club Soccer</h1>
      <PlayerCard 
      image={PlayerImage}
      />
      <MatchCard className="mt-6"
        awayTeam="University of Montana"
        date="2025-02-15"
        homeTeam="Montana State"
        location="Lambert Turf Field"
        status="upcoming"
        time="19:00"
      />
      <MatchCard className="mt-6"
        awayTeam="University of Utah"
        date="2025-03-21"
        homeTeam="Montana State"
        location="Lambert Turf Field"
        status="upcoming"
        time="17:00"
      />
      <MatchCard className="mt-6"
        awayTeam="Gonzaga University"
        date="2025-04-9"
        homeTeam="Montana State"
        location="Lambert Turf Field"
        status="upcoming"
        time="20:00"
      />
    </div>
  )
}

export default Home
