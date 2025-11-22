import { useState, useEffect } from 'react'
import { ArrowLeft, Users, MapPin, Mail, Phone, User, Trophy, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { teamApi } from '../utils/api'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface TeamProfilePageProps {
  teamId: string
  onBack: () => void
}

interface Member {
  id: string
  name: string
  age: number | null
  email: string | null
  phone: string | null
}

interface StageResult {
  score: number
  time: number
  completed: boolean
}

interface Results {
  stage1: StageResult
  stage2: StageResult
  stage3: StageResult
  totalScore: number
}

interface Team {
  id: string
  name: string
  region: string
  logo: string | null
  status: string
  email: string
}

export function TeamProfilePage({ teamId, onBack }: TeamProfilePageProps) {
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamData()
  }, [teamId])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      const data = await teamApi.getById(teamId)
      setTeam(data.team)
      setMembers(data.members || [])
      setResults(data.results)
    } catch (error) {
      console.error('Error loading team data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Komanda tapılmadı</p>
        <Button onClick={onBack} className="mt-4">Geri</Button>
      </div>
    )
  }

  const stages = [
    { name: 'Onlayn Seçim İmtahanı', duration: '2 saat', data: results?.stage1 },
    { name: 'Əyani İmtahan', duration: '2 saat', data: results?.stage2 },
    { name: 'Praktiki Yarış', duration: '3 saat', data: results?.stage3 }
  ]

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Komandalar
      </Button>

      {/* Team Header */}
      <div className="cyber-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-100 to-blue-100 opacity-50 rounded-full -mr-32 -mt-32" />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Logo */}
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 glow-blue-sm">
            {team.logo ? (
              <ImageWithFallback
                src={team.logo}
                alt={team.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-12 h-12 text-cyan-600" />
            )}
          </div>

          {/* Team Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl text-gray-800">{team.name}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                team.status === 'Finalçı'
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
                  : team.status === 'Seçilib'
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                  : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700'
              }`}>
                {team.status}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <span>{team.region}</span>
              </div>
              {team.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-600" />
                  <span>{team.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total Score */}
          {results && (
            <div className="cyber-card p-6 text-center bg-gradient-to-br from-cyan-50 to-blue-50">
              <Trophy className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <div className="text-3xl text-gray-800 mb-1">{results.totalScore}</div>
              <div className="text-sm text-gray-600">Ümumi Bal</div>
            </div>
          )}
        </div>
      </div>

      {/* Stage Results */}
      {results && (
        <div>
          <h2 className="text-2xl mb-6 text-gray-800">Mərhələ Nəticələri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stages.map((stage, index) => (
              <div key={index} className="cyber-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cyan-600">Mərhələ {index + 1}</span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{stage.duration}</span>
                  </div>
                </div>
                
                <h3 className="text-lg mb-4 text-gray-800">{stage.name}</h3>
                
                {stage.data?.completed ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Bal:</span>
                      <span className="text-2xl text-cyan-600">{stage.data.score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vaxt:</span>
                      <span className="text-gray-800">{stage.data.time} dəq</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    Tamamlanmayıb
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div>
        <h2 className="text-2xl mb-6 text-gray-800">
          Komanda Üzvləri ({members.length})
        </h2>
        
        {members.length === 0 ? (
          <div className="cyber-card p-8 text-center text-gray-600">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Komanda üzvü əlavə edilməyib</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div key={member.id} className="cyber-card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-cyan-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-800 mb-2">{member.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {member.age && (
                        <div>Yaş: {member.age}</div>
                      )}
                      {member.email && (
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
