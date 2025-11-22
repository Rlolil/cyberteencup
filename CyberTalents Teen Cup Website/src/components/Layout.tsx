import { Shield, Home, Users, Trophy, Mail, UserPlus, LogIn } from 'lucide-react'
import { Button } from './ui/button'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const navItems = [
    { id: 'home', label: 'Əsas Səhifə', icon: Home },
    { id: 'teams', label: 'Komandalar', icon: Users },
    { id: 'results', label: 'Nəticələr', icon: Trophy },
    { id: 'contact', label: 'Əlaqə', icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-cyan-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg glow-blue-sm group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block text-gray-800">
                CyberTalents Teen Cup
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('registration')}
                className="hidden sm:flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Qeydiyyat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('admin')}
                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              >
                <LogIn className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  currentPage === item.id
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-cyan-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-800">CyberTalents Teen Cup</span>
              </div>
              <p className="text-gray-600 text-sm">
                Gənclərin kibertəhlükəsizlik bacarıqlarını inkişaf etdirən milli müsabiqə
              </p>
            </div>

            <div>
              <h4 className="text-gray-800 mb-3">Keçidlər</h4>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="text-gray-600 hover:text-cyan-600 text-sm text-left transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gray-800 mb-3">Əlaqə</h4>
              <div className="text-gray-600 text-sm space-y-2">
                <p>Email: info@cybertalents.az</p>
                <p>Tel: +994 12 345 67 89</p>
                <p>Ünvan: Bakı, Azərbaycan</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-cyan-200/50 text-center text-gray-600 text-sm">
            <p>&copy; 2025 CyberTalents Teen Cup. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
