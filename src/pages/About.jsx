import { Card, ImageBlock, Button, Spinner, Modal, Input, Divider } from 'mscss-montana';
import PlayerImage from '../images/about-image.jpg';
import SecondImage from '../images/about-image2.jpg';

function About() {
  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">About us! ⚽</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <ImageBlock
            aspectRatio="panoramic"
            image={PlayerImage}
          />
        </div>

        <div className="md:w-1/2 p-4 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Who We Are</h2>

          <p className="mb-4">
            The Montana State Club Soccer team is a dedicated group of students passionate about competitive soccer. We compete in the NIRSA Region VI against other collegiate club teams in the Pacific Northwest.
          </p>

          <Divider />

          <h3 className="text-xl font-medium mt-4 mb-2">Our Mission</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Foster a competitive and fun environment for all members.</li>
            <li>Represent Montana State University with sportsmanship and dedication.</li>
            <li>Promote health, fitness, and community among MSU students.</li>
          </ul>

        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 p-4 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">GoFundMe</h2>

          <p className="mb-4">
            <strong>🏆 Big Sky Champions Headed to California! ✈️</strong>
            <br /><br />
            We are thrilled to announce that after winning the Big Sky Conference this 2025 season, the Montana State Club Soccer team has earned an incredible opportunity: a trip to a major tournament in Orange County, California!
            <br /><br />
            This trip marks a huge milestone—it will be the FIRST TIME in club history that we are flying to a tournament, breaking from our usual driving routine. To make this historic journey possible and ensure our team can represent MSU on the national stage, we need your support!
            <br /><br />
            Please consider donating to our GoFundMe. Every contribution brings us closer to California and means the world to our dedicated players! Thank you for supporting MSU Club Soccer!
          </p>

          <p>
            <a
              href="https://www.gofundme.com/f/msu-mens-club-soccer-usccs-playoff-tournament"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold underline"
            >
              Click Here to Donate on GoFundMe!
            </a>
          </p>

          <Divider />

        </div>

        <div className="md:w-1/2">
          <ImageBlock
            aspectRatio="panoramic"
            image={SecondImage}
          />
        </div>
      </div>

    </div>
  )
}

export default About