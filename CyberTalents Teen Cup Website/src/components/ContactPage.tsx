import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { contactApi } from '../utils/api'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await contactApi.send(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl mb-4 text-gray-800">Əlaqə</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Suallarınız var? Bizimlə əlaqə saxlayın. Komandamız sizə kömək etməkdən məmnun olacaq.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="cyber-card p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-800">Email</h3>
            <p className="text-gray-600 text-sm mb-2">Bizə email göndərin</p>
            <a
              href="mailto:info@cybertalents.az"
              className="text-cyan-600 hover:text-cyan-700 text-sm"
            >
              info@cybertalents.az
            </a>
          </div>

          <div className="cyber-card p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-800">Telefon</h3>
            <p className="text-gray-600 text-sm mb-2">Bizimlə əlaqə saxlayın</p>
            <a
              href="tel:+994123456789"
              className="text-cyan-600 hover:text-cyan-700 text-sm"
            >
              +994 12 345 67 89
            </a>
          </div>

          <div className="cyber-card p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-lg mb-2 text-gray-800">Ünvan</h3>
            <p className="text-gray-600 text-sm mb-2">Ofisimizə baş çəkin</p>
            <p className="text-gray-800 text-sm">
              Bakı şəhəri, Azərbaycan
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="cyber-card p-8">
            <h2 className="text-2xl mb-6 text-gray-800">Mesaj Göndər</h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-green-800 mb-1">Mesajınız göndərildi!</div>
                  <div className="text-green-700 text-sm">
                    Tezliklə sizinlə əlaqə saxlayacağıq.
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Ad, Soyad <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Adınızı daxil edin"
                    required
                  />
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
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Telefon</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+994 XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Mesaj <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı buraya yazın..."
                  rows={6}
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
                    Göndərilir...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Göndər
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="cyber-card p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="aspect-video rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
            <p className="text-gray-600">Xəritə</p>
          </div>
        </div>
      </div>
    </div>
  )
}
