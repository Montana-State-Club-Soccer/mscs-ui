import { Header, Footer, Button, Logo } from '@montana-state-club-soccer/mscss'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-500">
      <Header
        actions={
          <>
            <Button variant="secondary">Sign In</Button>
            <Button variant="primary">Join Team</Button>
          </>
        }
        logo={<Logo size="md" />}
        navItems={[
          {
            href: '/',
            label: 'Home'
          },
          {
            href: '/schedule',
            label: 'Schedule'
          },
          {
            href: '/roster',
            label: 'Roster'
          },
          {
            href: '/results',
            label: 'Results'
          },
          {
            href: '/about',
            label: 'About'
          }
        ]}
      />
      <main className="flex-grow">
        <div className="container mx-auto py-8 max-w-10xl">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </div>
      </main>
      <Footer 
        colorScheme="blue"
        copyright={`© ${new Date().getFullYear()} Montana State Club Soccer`}
      />
    </div>
  )
}

export default Layout
