import { MatchCard, TabsList, TabsContent, Tabs, TabsTrigger, ImageBlock, Divider } from '@montana-state-club-soccer/mscss'
import PlayerImage from '../images/team24.jpg';

function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Welcome to Montana State Club Soccer</h1>

      <ImageBlock 
      aspectRatio="panoramic" 
      image={PlayerImage}
      />

      <Divider className='mt-6' variant="secondary"/>

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
      
      <Tabs className = "mt-6" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-2">
            <h3 className="font-bold">Overview</h3>
            <p>This is the overview section with more detailed content.</p>
            <ul className="list-disc list-inside">
              <li>Point 1</li>
              <li>Point 2</li>
              <li>Point 3</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-2">
            <h3 className="font-bold">Details</h3>
            <p>This section contains detailed information.</p>
          </div>
        </TabsContent>

      </Tabs>

    </div>
  )
}

export default Home
