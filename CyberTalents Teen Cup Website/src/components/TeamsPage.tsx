import { useState, useEffect } from 'react'
import { Users, MapPin, Search, Filter } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { teamApi } from '../utils/api'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface Team {
  id: string
  name: string
  region: string
  logo: string | null
  status: string
  email: string
  createdAt: string
}

interface TeamsPageProps {
  onTeamClick: (teamId: string) => void
}

export function TeamsPage({ onTeamClick }: TeamsPageProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const data = await teamApi.getAll()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const regions = Array.from(new Set(teams.map(t => t.region)))
  const statuses = Array.from(new Set(teams.map(t => t.status)))

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = regionFilter === 'all' || team.region === regionFilter
    const matchesStatus = statusFilter === 'all' || team.status === statusFilter
    
    return matchesSearch && matchesRegion && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Komandalar yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl mb-4 text-gray-800">Komandalar</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          CyberTalents Teen Cup-da iştirak edən bütün komandalar. 
          Komanda profilini görmək üçün karta klikləyin.
        </p>
      </div>

      {/* Filters */}
      <div className="cyber-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Komanda və ya region axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Region Filter */}
          <div>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Bütün Regionlar</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Bütün Statuslar</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredTeams.length} komanda tapıldı</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setRegionFilter('all')
              setStatusFilter('all')
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtri Sıfırla
          </Button>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Heç bir komanda tapılmadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => (
            <button
              key={team.id}
              onClick={() => onTeamClick(team.id)}
              className="cyber-card p-6 text-left group animate-slide-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Logo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {team.logo ? (
                    <ImageWithFallback
                      src={team.logo}
                      alt={team.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-cyan-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg text-gray-800 group-hover:text-cyan-600 transition-colors truncate">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{team.region}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                  team.status === 'Finalçı'
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
                    : team.status === 'Seçilib'
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                    : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700'
                }`}>
                  {team.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(team.createdAt).toLocaleDateString('az-AZ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
