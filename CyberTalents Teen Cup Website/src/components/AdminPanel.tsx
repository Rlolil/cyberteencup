import { useState, useEffect } from 'react'
import { LogOut, Users, Trophy, Mail, BarChart3, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { adminApi } from '../utils/api'
import { createClient } from '../utils/supabase/client'

interface AdminPanelProps {
  onLogout: () => void
}

interface Team {
  id: string
  name: string
  region: string
  logo: string | null
  status: string
  email: string
}

interface Member {
  id: string
  teamId: string
  name: string
  age: number | null
  email: string | null
  phone: string | null
}

interface Results {
  teamId: string
  stage1: { score: number; time: number; completed: boolean }
  stage2: { score: number; time: number; completed: boolean }
  stage3: { score: number; time: number; completed: boolean }
  totalScore: number
}

interface Message {
  id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
  read: boolean
}

interface Stats {
  totalTeams: number
  totalMessages: number
  unreadMessages: number
  regionDistribution: Record<string, number>
  statusDistribution: Record<string, number>
  averageScore: number
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'teams' | 'results' | 'messages' | 'stats'>('teams')
  const [token, setToken] = useState<string>('')
  const [teams, setTeams] = useState<Team[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Edit states
  const [editingTeam, setEditingTeam] = useState<string | null>(null)
  const [editingResults, setEditingResults] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})

  useEffect(() => {
    getAccessToken()
  }, [])

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token, activeTab])

  const getAccessToken = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      setToken(session.access_token)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'teams') {
        const response = await fetch(
          `https://${(await import('../utils/supabase/info')).projectId}.supabase.co/functions/v1/make-server-e5b94f28/teams`,
          {
            headers: {
              'Authorization': `Bearer ${(await import('../utils/supabase/info')).publicAnonKey}`
            }
          }
        )
        const data = await response.json()
        setTeams(data.teams || [])
      } else if (activeTab === 'messages') {
        const data = await adminApi.getMessages(token)
        setMessages(data.messages || [])
      } else if (activeTab === 'stats') {
        const data = await adminApi.getStats(token)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Bu komandanı silmək istədiyinizdən əminsiniz?')) return
    
    try {
      await adminApi.deleteTeam(teamId, token)
      loadData()
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Xəta baş verdi')
    }
  }

  const handleUpdateTeam = async (teamId: string) => {
    try {
      await adminApi.updateTeam(teamId, editData, token)
      setEditingTeam(null)
      setEditData({})
      loadData()
    } catch (error) {
      console.error('Error updating team:', error)
      alert('Xəta baş verdi')
    }
  }

  const handleUpdateResults = async (teamId: string) => {
    try {
      await adminApi.updateResults(teamId, editData, token)
      setEditingResults(null)
      setEditData({})
      loadData()
    } catch (error) {
      console.error('Error updating results:', error)
      alert('Xəta baş verdi')
    }
  }

  const handleMarkMessageRead = async (messageId: string) => {
    try {
      await adminApi.markMessageRead(messageId, token)
      loadData()
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-gray-800">Admin Panel</h1>
        <Button
          variant="outline"
          onClick={onLogout}
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Çıxış
        </Button>
      </div>

      {/* Tabs */}
      <div className="cyber-card p-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('teams')}
            className={`p-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'teams'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">Komandalar</span>
          </button>
          
          <button
            onClick={() => setActiveTab('results')}
            className={`p-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'results'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="hidden sm:inline">Nəticələr</span>
          </button>
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`p-3 rounded-lg transition-all flex items-center justify-center gap-2 relative ${
              activeTab === 'messages'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="hidden sm:inline">Mesajlar</span>
            {messages.filter(m => !m.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className={`p-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'stats'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="hidden sm:inline">Statistika</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="space-y-4">
              {teams.map(team => (
                <div key={team.id} className="cyber-card p-6">
                  {editingTeam === team.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Komanda adı"
                          value={editData.name || team.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <Input
                          placeholder="Region"
                          value={editData.region || team.region}
                          onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                        />
                        <select
                          value={editData.status || team.status}
                          onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                          className="h-10 px-3 rounded-md border border-gray-300 bg-white"
                        >
                          <option value="İştirakçı">İştirakçı</option>
                          <option value="Seçilib">Seçilib</option>
                          <option value="Finalçı">Finalçı</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTeam(team.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Yadda Saxla
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTeam(null)
                            setEditData({})
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Ləğv Et
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg text-gray-800">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.region} • {team.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTeam(team.id)
                            setEditData({})
                          }}
                          className="border-cyan-300 text-cyan-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="border-red-300 text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              {teams.map(team => (
                <div key={team.id} className="cyber-card p-6">
                  <h3 className="text-lg text-gray-800 mb-4">{team.name}</h3>
                  {editingResults === team.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Mərhələ 1 - Bal</label>
                          <Input
                            type="number"
                            placeholder="Bal"
                            value={editData.stage1?.score ?? 0}
                            onChange={(e) => setEditData({
                              ...editData,
                              stage1: { ...editData.stage1, score: parseInt(e.target.value) || 0, completed: true }
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Mərhələ 2 - Bal</label>
                          <Input
                            type="number"
                            placeholder="Bal"
                            value={editData.stage2?.score ?? 0}
                            onChange={(e) => setEditData({
                              ...editData,
                              stage2: { ...editData.stage2, score: parseInt(e.target.value) || 0, completed: true }
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Mərhələ 3 - Bal</label>
                          <Input
                            type="number"
                            placeholder="Bal"
                            value={editData.stage3?.score ?? 0}
                            onChange={(e) => setEditData({
                              ...editData,
                              stage3: { ...editData.stage3, score: parseInt(e.target.value) || 0, completed: true }
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateResults(team.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Yadda Saxla
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingResults(null)
                            setEditData({})
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Ləğv Et
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Nəticələri dəyişmək üçün redaktə edin
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingResults(team.id)
                          setEditData({})
                        }}
                        className="border-cyan-300 text-cyan-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Redaktə Et
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="cyber-card p-12 text-center text-gray-600">
                  Mesaj yoxdur
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`cyber-card p-6 ${!message.read ? 'bg-cyan-50/50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-800">{message.name}</h3>
                        <p className="text-sm text-gray-600">{message.email}</p>
                        {message.phone && (
                          <p className="text-sm text-gray-600">{message.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString('az-AZ')}
                        </span>
                        {!message.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkMessageRead(message.id)}
                            className="ml-2 border-cyan-300 text-cyan-700"
                          >
                            Oxundu işarəsi qoy
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="cyber-card p-6">
                <div className="text-3xl text-cyan-600 mb-2">{stats.totalTeams}</div>
                <div className="text-gray-600">Ümumi Komanda</div>
              </div>
              
              <div className="cyber-card p-6">
                <div className="text-3xl text-cyan-600 mb-2">{stats.totalMessages}</div>
                <div className="text-gray-600">Ümumi Mesaj</div>
              </div>
              
              <div className="cyber-card p-6">
                <div className="text-3xl text-orange-600 mb-2">{stats.unreadMessages}</div>
                <div className="text-gray-600">Oxunmamış Mesaj</div>
              </div>
              
              <div className="cyber-card p-6">
                <div className="text-3xl text-cyan-600 mb-2">{stats.averageScore.toFixed(1)}</div>
                <div className="text-gray-600">Orta Bal</div>
              </div>
              
              <div className="cyber-card p-6 md:col-span-2">
                <h3 className="text-lg text-gray-800 mb-4">Region üzrə Bölgü</h3>
                <div className="space-y-2">
                  {Object.entries(stats.regionDistribution).map(([region, count]) => (
                    <div key={region} className="flex items-center justify-between">
                      <span className="text-gray-600">{region}</span>
                      <span className="text-cyan-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
