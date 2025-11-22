import { useState } from 'react'
import { Shield, CheckCircle, Copy } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { adminApi } from '../utils/api'
import { projectId, publicAnonKey } from '../utils/supabase/info'

export function AdminSetup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e5b94f28/admin/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Xəta baş verdi')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Admin yaradılarkən xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  const copyScript = () => {
    const script = `// Admin yaratmaq üçün browser console-da çalışdırın
const projectId = '${projectId}';
const publicAnonKey = '${publicAnonKey}';

fetch(\`https://\${projectId}.supabase.co/functions/v1/make-server-e5b94f28/admin/signup\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${publicAnonKey}\`
  },
  body: JSON.stringify({
    email: 'admin@cybertalents.az',
    password: 'admin123456',
    name: 'Admin İstifadəçi'
  })
})
.then(r => r.json())
.then(data => console.log('Admin yaradıldı:', data))
.catch(err => console.error('Xəta:', err));`

    navigator.clipboard.writeText(script)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="cyber-card p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl mb-4 text-gray-800">Admin Yaradıldı!</h2>
            <p className="text-gray-600 mb-8">
              Admin hesabınız uğurla yaradıldı. İndi giriş edə bilərsiniz.
            </p>
            <div className="bg-cyan-50 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-gray-700 mb-1"><strong>Email:</strong> {formData.email}</p>
              <p className="text-sm text-gray-700"><strong>Şifrə:</strong> {formData.password}</p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              Giriş Səhifəsinə Keç
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-blue animate-pulse-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl mb-4 text-gray-800">İlk Admin Yaradılması</h1>
          <p className="text-gray-600">
            Admin panelə daxil olmaq üçün ilk admin hesabını yaradın
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Method */}
          <div className="cyber-card p-6">
            <h3 className="text-lg mb-4 text-gray-800">Üsul 1: Forma ilə</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">Ad</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Admin"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@cybertalents.az"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">Şifrə</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Yaradılır...
                  </>
                ) : (
                  'Admin Yarat'
                )}
              </Button>
            </form>
          </div>

          {/* Console Method */}
          <div className="cyber-card p-6">
            <h3 className="text-lg mb-4 text-gray-800">Üsul 2: Console ilə</h3>
            <p className="text-sm text-gray-600 mb-4">
              Browser console-da (F12) aşağıdakı kodu çalışdırın:
            </p>

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto mb-4">
              <pre className="whitespace-pre-wrap">
{`fetch('https://${projectId}.supabase.co/functions/v1/make-server-e5b94f28/admin/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${publicAnonKey.substring(0, 20)}...'
  },
  body: JSON.stringify({
    email: 'admin@cybertalents.az',
    password: 'admin123456',
    name: 'Admin'
  })
})
.then(r => r.json())
.then(console.log)`}
              </pre>
            </div>

            <Button
              variant="outline"
              onClick={copyScript}
              className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Kodu Kopyala
            </Button>
          </div>
        </div>

        <div className="mt-6 cyber-card p-6">
          <h3 className="text-lg mb-3 text-gray-800">💡 Tövsiyələr</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Güclü şifrə seçin (minimum 6 simvol)</li>
            <li>• Admin girişi məlumatlarını təhlükəsiz saxlayın</li>
            <li>• Admin paneldən əlavə admin hesabları yarada bilərsiniz</li>
            <li>• Bu proses yalnız bir dəfə lazımdır</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Artıq admin hesabınız var?{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-cyan-600 hover:text-cyan-700"
            >
              Giriş səhifəsinə keçin
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
