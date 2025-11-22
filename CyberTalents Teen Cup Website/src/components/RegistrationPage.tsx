import { useState } from 'react'
import { UserPlus, Plus, Trash2, CheckCircle, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { teamApi } from '../utils/api'

interface TeamMember {
  id: string
  name: string
  age: string
  email: string
  phone: string
}

export function RegistrationPage() {
  const [formData, setFormData] = useState({
    teamName: '',
    region: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: '', age: '', email: '', phone: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const regions = [
    'Bakı',
    'Gəncə',
    'Sumqayıt',
    'Mingəçevir',
    'Şəki',
    'Lənkəran',
    'Naxçıvan',
    'Qarabağ',
    'Abşeron',
    'Şamaxı',
    'Quba',
    'Qax',
    'Şuşa',
    'Digər'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    )
  }

  const addMember = () => {
    setMembers(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', age: '', email: '', phone: '' }
    ])
  }

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Şifrələr uyğun gəlmir')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Şifrə ən azı 6 simvol olmalıdır')
      setLoading(false)
      return
    }

    const hasValidMember = members.some(m => m.name.trim() !== '')
    if (!hasValidMember) {
      setError('Ən azı bir komanda üzvü əlavə edin')
      setLoading(false)
      return
    }

    try {
      const validMembers = members.filter(m => m.name.trim() !== '').map(m => ({
        name: m.name,
        age: m.age ? parseInt(m.age) : null,
        email: m.email || null,
        phone: m.phone || null
      }))

      await teamApi.signup({
        email: formData.email,
        password: formData.password,
        teamName: formData.teamName,
        region: formData.region,
        members: validMembers
      })

      setSuccess(true)
      // Reset form
      setFormData({
        teamName: '',
        region: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      setMembers([{ id: '1', name: '', age: '', email: '', phone: '' }])
    } catch (err: any) {
      setError(err.message || 'Qeydiyyat zamanı xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="cyber-card p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl mb-4 text-gray-800">Qeydiyyat Uğurla Tamamlandı!</h2>
          <p className="text-gray-600 mb-8">
            Komandanız uğurla qeydiyyatdan keçdi. Müsabiqə haqqında əlavə məlumat 
            email ünvanınıza göndəriləcək.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            Yeni Qeydiyyat
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl mb-4 text-gray-800">Komanda Qeydiyyatı</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          CyberTalents Teen Cup müsabiqəsinə qatılmaq üçün komandanızı qeydiyyatdan keçirin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Information */}
        <div className="cyber-card p-8">
          <h2 className="text-2xl mb-6 text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            Komanda Məlumatları
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Komanda Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Məsələn: CyberHawks"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Region seçin</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="team@example.com"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Giriş üçün istifadə ediləcək
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Şifrə <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Şifrə Təkrarı <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="cyber-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-800 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-cyan-600" />
              Komanda Üzvləri
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMember}
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Üzv Əlavə Et
            </Button>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={member.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Üzv {index + 1}</span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 mb-2 text-sm">
                      Ad, Soyad {index === 0 && <span className="text-red-500">*</span>}
                    </label>
                    <Input
                      value={member.name}
                      onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                      placeholder="Ad və soyadı daxil edin"
                      required={index === 0}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Yaş</label>
                    <Input
                      type="number"
                      value={member.age}
                      onChange={(e) => handleMemberChange(member.id, 'age', e.target.value)}
                      placeholder="Yaşı"
                      min="10"
                      max="20"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">Telefon</label>
                    <Input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => handleMemberChange(member.id, 'phone', e.target.value)}
                      placeholder="+994 XX XXX XX XX"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 mb-2 text-sm">Email</label>
                    <Input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Qeydiyyat edilir...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Qeydiyyatdan Keç
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
