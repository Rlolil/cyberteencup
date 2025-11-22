import { useState } from 'react'
import { Shield, LogIn, ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { createClient } from '../utils/supabase/client'

interface AdminLoginProps {
  onLoginSuccess: () => void
  onBack: () => void
}

export function AdminLogin({ onLoginSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (!data.session) {
        throw new Error('Giriş uğursuz oldu')
      }

      // Check if user is admin
      const userMetadata = data.user?.user_metadata
      if (userMetadata?.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error('Admin girişi tələb olunur')
      }

      onLoginSuccess()
    } catch (err: any) {
      console.error('Admin login error:', err)
      setError(err.message || 'Giriş zamanı xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Əsas Səhifə
        </Button>

        {/* Login Card */}
        <div className="cyber-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-blue">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl text-gray-800 mb-2">Admin Girişi</h2>
            <p className="text-gray-600">
              İdarəetmə panelinə daxil olmaq üçün giriş edin
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cybertalents.az"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Şifrə</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Giriş edilir...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Daxil Ol
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
            <p className="text-sm text-cyan-800">
              <strong>Demo üçün:</strong> Admin hesabı yaratmaq üçün sistem administratoru ilə əlaqə saxlayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
