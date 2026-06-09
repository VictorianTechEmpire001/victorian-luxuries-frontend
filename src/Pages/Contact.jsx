import { useState } from 'react'
import contactBg from '../assets/images/watches/contact-bg.jpg'

const API_URL = 'http://localhost:5000'
const MAX_MESSAGE_LENGTH = 500

const Contact = () => {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your full name.'
    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim()) {
      newErrors.message = 'Please enter your message.'
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || 'General Inquiry',
          message: form.message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Failed to send message. Please try again.')
        return
      }

      setSubmitted(true)

    } catch (error) {
      setServerError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">

      {/* Background Image */}
      <img
        src={contactBg}
        alt="Contact Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16 py-20">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="text-center mb-8 md:mb-10">
            <p className="text-yellow-500 text-xs md:text-sm uppercase tracking-widest mb-2">
              Get In Touch
            </p>
            <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-3">
              Link Up With Us
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Join the Victorian Luxuries family and stay connected
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-500 text-3xl">✓</span>
              </div>
              <h2 className="text-white font-serif font-bold text-xl md:text-2xl mb-3">
                Message Sent! 👑
              </h2>
              <p className="text-gray-300 text-sm md:text-base mb-2">
                Thank you <span className="text-yellow-500 font-semibold">{form.name}</span>!
              </p>
              <p className="text-gray-400 text-sm mb-6">
                We'll get back to you at <span className="text-white">{form.email}</span> within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setForm({ name: '', email: '', subject: '', message: '' })
                }}
                className="text-yellow-500 text-sm border border-yellow-500 rounded px-6 py-2 hover:bg-yellow-500 hover:text-black transition">
                Send Another Message
              </button>
            </div>
          ) : (

            /* Form */
            <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8">

              {/* Server Error */}
              {serverError && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 rounded px-4 py-3 text-sm mb-4">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-4">

                {/* Name */}
                <div>
                  <label className="text-gray-300 text-xs md:text-sm mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                      errors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-300 text-xs md:text-sm mb-1 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    spellCheck="false"
                    placeholder="Enter your email address"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="text-gray-300 text-xs md:text-sm mb-1 block">
                    Subject <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    className="w-full bg-zinc-900 border border-gray-600 text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-gray-300 text-xs md:text-sm mb-1 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition resize-none ${
                      errors.message ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.message ? (
                      <p className="text-red-400 text-xs">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <p className={`text-xs ml-auto ${
                      form.message.length >= MAX_MESSAGE_LENGTH
                        ? 'text-red-400'
                        : form.message.length >= MAX_MESSAGE_LENGTH * 0.8
                        ? 'text-yellow-500'
                        : 'text-gray-500'
                    }`}>
                      {form.message.length}/{MAX_MESSAGE_LENGTH}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Sending Message...' : 'Link Up With Us'}
                </button>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Contact