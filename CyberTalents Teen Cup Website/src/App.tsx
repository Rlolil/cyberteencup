import { useState, useEffect } from 'react'
import { Layout } from './components/Layout'
import { HomePage } from './components/HomePage'
import { TeamsPage } from './components/TeamsPage'
import { TeamProfilePage } from './components/TeamProfilePage'
import { ResultsPage } from './components/ResultsPage'
import { ContactPage } from './components/ContactPage'
import { RegistrationPage } from './components/RegistrationPage'
import { AdminLogin } from './components/AdminLogin'
import { AdminPanel } from './components/AdminPanel'
import { createClient } from './utils/supabase/client'

type Page = 'home' | 'teams' | 'teamProfile' | 'results' | 'contact' | 'registration' | 'admin' | 'adminPanel'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    checkAdminSession()
  }, [])

  const checkAdminSession = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user?.user_metadata?.role === 'admin') {
      setIsAdminLoggedIn(true)
      setCurrentPage('adminPanel')
    }
  }

  const handleNavigate = (page: string, teamId?: string) => {
    if (page === 'teamProfile' && teamId) {
      setSelectedTeamId(teamId)
      setCurrentPage('teamProfile')
    } else {
      setCurrentPage(page as Page)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTeamClick = (teamId: string) => {
    handleNavigate('teamProfile', teamId)
  }

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true)
    setCurrentPage('adminPanel')
  }

  const handleAdminLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsAdminLoggedIn(false)
    setCurrentPage('home')
  }

  // Admin pages without main layout
  if (currentPage === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBack={() => handleNavigate('home')}
          />
        </div>
      </div>
    )
  }

  if (currentPage === 'adminPanel' && isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPanel onLogout={handleAdminLogout} />
        </div>
      </div>
    )
  }

  // Main application with layout
  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      
      {currentPage === 'teams' && <TeamsPage onTeamClick={handleTeamClick} />}
      
      {currentPage === 'teamProfile' && (
        <TeamProfilePage
          teamId={selectedTeamId}
          onBack={() => handleNavigate('teams')}
        />
      )}
      
      {currentPage === 'results' && <ResultsPage />}
      
      {currentPage === 'contact' && <ContactPage />}
      
      {currentPage === 'registration' && <RegistrationPage />}
    </Layout>
  )
}
