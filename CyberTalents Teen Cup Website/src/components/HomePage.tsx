import { Calendar, Trophy, Users, Zap, ArrowRight, Target, Shield, Code } from 'lucide-react'
import { Button } from './ui/button'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Kibertəhlükəsizlik',
      description: 'Müasir kibertəhlükəsizlik problemlərini həll edin'
    },
    {
      icon: Code,
      title: 'Praktiki Bacarıqlar',
      description: 'Real dünya ssenarilərində öz bacarıqlarınızı sınayın'
    },
    {
      icon: Trophy,
      title: 'Mükafatlar',
      description: 'Qalibləri qiymətli mükafatlar gözləyir'
    },
    {
      icon: Users,
      title: 'Komanda İşi',
      description: 'Komandanızla birgə işləyərək uğur qazanın'
    }
  ]

  const stages = [
    {
      stage: '1-ci Mərhələ',
      title: 'Onlayn Seçim İmtahanı',
      duration: '2 saat',
      description: 'Nəzəri biliklərin yoxlanılması',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      stage: '2-ci Mərhələ',
      title: 'Əyani İmtahan',
      duration: '2 saat',
      description: 'Komanda qərarları və strateji təhlil',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      stage: '3-cü Mərhələ',
      title: 'Praktiki Yarış',
      duration: '3 saat',
      description: 'CTF formatında praktiki tapşırıqlar',
      color: 'from-indigo-400 to-purple-500'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="cyber-grid-bg absolute inset-0 opacity-50" />
        <div className="relative py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-6 animate-pulse-glow">
            <Zap className="w-4 h-4" />
            <span className="text-sm">2025 Müsabiqəsi</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            CyberTalents Teen Cup
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Gənclərin kibertəhlükəsizlik bacarıqlarını inkişaf etdirən milli müsabiqə. 
            Komandanızı yaradın və rəqəmsal gələcəyin qəhrəmanı olun!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate('registration')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Qeydiyyat
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('teams')}
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
            >
              <Users className="w-5 h-5 mr-2" />
              Komandalar
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('results')}
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Nəticələr
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-800">Nəyə Görə İştirak Etməlisiniz?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CyberTalents Teen Cup kibertəhlükəsizlik sahəsində maraqlı olan gənclər üçün 
            unikal imkan yaradır
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="cyber-card p-6 text-center animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl mb-4">
                <feature.icon className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-lg mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Competition Stages */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-800">Müsabiqə Mərhələləri</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Müsabiqə üç mərhələdən ibarətdir. Hər mərhələdə iştirakçıların 
            müxtəlif bacarıqları yoxlanılır
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="cyber-card p-6 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stage.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-cyan-600">{stage.stage}</span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{stage.duration}</span>
                  </div>
                </div>
                
                <h3 className="text-xl mb-2 text-gray-800">{stage.title}</h3>
                <p className="text-gray-600 text-sm">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="cyber-grid-bg absolute inset-0 opacity-20" />
        
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl mb-2">100+</div>
            <div className="text-cyan-100 text-sm">Komanda</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl mb-2">400+</div>
            <div className="text-cyan-100 text-sm">İştirakçı</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl mb-2">3</div>
            <div className="text-cyan-100 text-sm">Mərhələ</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl mb-2">7</div>
            <div className="text-cyan-100 text-sm">Saat</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <div className="cyber-card p-8 sm:p-12 max-w-3xl mx-auto">
          <Target className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
          <h2 className="text-3xl mb-4 text-gray-800">Hazırsınız?</h2>
          <p className="text-gray-600 mb-8">
            Komandanızı qeydiyyatdan keçirin və kibertəhlükəsizlik dünyasında 
            öz yerınızı alın!
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('registration')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            İndi Qeydiyyatdan Keç
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
