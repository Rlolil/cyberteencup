import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Clock } from 'lucide-react'
import { resultsApi } from '../utils/api'

interface Result {
  teamId: string
  teamName: string
  region: string
  status: string
  stage1: { score: number; time: number; completed: boolean }
  stage2: { score: number; time: number; completed: boolean }
  stage3: { score: number; time: number; completed: boolean }
  totalScore: number
}

export function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'stage1' | 'stage2' | 'stage3'>('all')

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const data = await resultsApi.getAll()
      setResults(data.results || [])
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSortedResults = () => {
    let sorted = [...results]
    
    if (activeTab === 'stage1') {
      sorted = sorted.filter(r => r.stage1.completed)
      sorted.sort((a, b) => {
        if (b.stage1.score !== a.stage1.score) {
          return b.stage1.score - a.stage1.score
        }
        return a.stage1.time - b.stage1.time
      })
    } else if (activeTab === 'stage2') {
      sorted = sorted.filter(r => r.stage2.completed)
      sorted.sort((a, b) => {
        if (b.stage2.score !== a.stage2.score) {
          return b.stage2.score - a.stage2.score
        }
        return a.stage2.time - b.stage2.time
      })
    } else if (activeTab === 'stage3') {
      sorted = sorted.filter(r => r.stage3.completed)
      sorted.sort((a, b) => {
        if (b.stage3.score !== a.stage3.score) {
          return b.stage3.score - a.stage3.score
        }
        return a.stage3.time - b.stage3.time
      })
    } else {
      sorted.sort((a, b) => b.totalScore - a.totalScore)
    }
    
    return sorted
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-orange-600" />
    return <span className="w-6 text-center text-gray-600">{rank}</span>
  }

  const tabs = [
    { id: 'all' as const, label: 'Ümumi Siyahı', duration: null },
    { id: 'stage1' as const, label: 'Onlayn Seçim İmtahanı', duration: '2 saat' },
    { id: 'stage2' as const, label: 'Əyani İmtahan', duration: '2 saat' },
    { id: 'stage3' as const, label: 'Praktiki Yarış', duration: '3 saat' }
  ]

  const sortedResults = getSortedResults()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Nəticələr yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl mb-4 text-gray-800">Nəticələr</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          CyberTalents Teen Cup müsabiqəsinin cari nəticələri və lider lövhə
        </p>
      </div>

      {/* Tabs */}
      <div className="cyber-card p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="text-sm mb-1">{tab.label}</div>
              {tab.duration && (
                <div className="flex items-center gap-1 text-xs opacity-80">
                  <Clock className="w-3 h-3" />
                  <span>{tab.duration}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      {sortedResults.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Hələ ki nəticə yoxdur</p>
        </div>
      ) : (
        <div className="cyber-card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700">Yer</th>
                  <th className="px-6 py-4 text-left text-gray-700">Komanda</th>
                  <th className="px-6 py-4 text-left text-gray-700">Region</th>
                  {activeTab === 'all' ? (
                    <>
                      <th className="px-6 py-4 text-center text-gray-700">1-ci Mərhələ</th>
                      <th className="px-6 py-4 text-center text-gray-700">2-ci Mərhələ</th>
                      <th className="px-6 py-4 text-center text-gray-700">3-cü Mərhələ</th>
                      <th className="px-6 py-4 text-center text-gray-700">Ümumi</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-center text-gray-700">Bal</th>
                      <th className="px-6 py-4 text-center text-gray-700">Vaxt (dəq)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <tr
                    key={result.teamId}
                    className="border-t border-gray-100 hover:bg-cyan-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankIcon(index + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800">{result.teamName}</div>
                      <div className="text-sm text-gray-500">{result.status}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{result.region}</td>
                    
                    {activeTab === 'all' ? (
                      <>
                        <td className="px-6 py-4 text-center">
                          <span className={result.stage1.completed ? 'text-gray-800' : 'text-gray-400'}>
                            {result.stage1.completed ? result.stage1.score : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={result.stage2.completed ? 'text-gray-800' : 'text-gray-400'}>
                            {result.stage2.completed ? result.stage2.score : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={result.stage3.completed ? 'text-gray-800' : 'text-gray-400'}>
                            {result.stage3.completed ? result.stage3.score : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg text-cyan-600">
                            {result.totalScore}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg text-cyan-600">
                            {result[activeTab].score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {result[activeTab].time}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {sortedResults.map((result, index) => (
              <div key={result.teamId} className="p-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 mt-1">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-800 mb-1">{result.teamName}</div>
                    <div className="text-sm text-gray-600">{result.region}</div>
                    <div className="text-sm text-gray-500">{result.status}</div>
                  </div>
                </div>

                {activeTab === 'all' ? (
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">M1</div>
                      <div className={result.stage1.completed ? 'text-gray-800' : 'text-gray-400'}>
                        {result.stage1.completed ? result.stage1.score : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">M2</div>
                      <div className={result.stage2.completed ? 'text-gray-800' : 'text-gray-400'}>
                        {result.stage2.completed ? result.stage2.score : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">M3</div>
                      <div className={result.stage3.completed ? 'text-gray-800' : 'text-gray-400'}>
                        {result.stage3.completed ? result.stage3.score : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Ümumi</div>
                      <div className="text-cyan-600">{result.totalScore}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-around text-sm">
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Bal</div>
                      <div className="text-cyan-600">{result[activeTab].score}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 text-xs mb-1">Vaxt</div>
                      <div className="text-gray-800">{result[activeTab].time} dəq</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
