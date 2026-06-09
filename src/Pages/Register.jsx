import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import registerBg from '../assets/images/watches/hero.jpg'

const API_URL = 'https://victorian-luxuries-backend.onrender.com'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const criteria = {
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    numberOrSymbol: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password),
    minLength: form.password.length >= 8,
  }

  const allCriteriaMet = Object.values(criteria).every(Boolean)

  const handleChange = (e) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
  setErrors(prev => ({ ...prev, [name]: '' }))
  setServerError('')
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your full name.'
    if (!form.email.trim()) newErrors.email = 'Please enter your email address.'
    if (!form.password.trim()) {
      newErrors.password = 'Please create a password.'
    } else if (!allCriteriaMet) {
      newErrors.password = 'Password does not meet all requirements.'
    }
    if (!form.confirm.trim()) {
      newErrors.confirm = 'Please confirm your password.'
    } else if (form.password !== form.confirm) {
      newErrors.confirm = 'Passwords do not match.'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Registration failed. Please try again.')
        return
      }

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)

    } catch (error) {
      setServerError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.634 6.621A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.176 5.204M15 12a3 3 0 00-3-3m0 0a3 3 0 00-2.121.879M3 3l18 18" />
    </svg>
  )

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  )

  const CriteriaBox = ({ met, label }) => (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded border text-xs transition-all duration-300 ${
      met ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : 'border-gray-600 bg-zinc-900 text-gray-500'
    }`}>
      <div className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        met ? 'bg-yellow-500 text-black' : 'bg-zinc-700'
      }`}>
        {met && <CheckIcon />}
      </div>
      <span>{label}</span>
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <img src={registerBg} alt="Register Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-75"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <p className="text-yellow-500 text-xs md:text-sm uppercase tracking-widest mb-2">Join Us</p>
            <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-3">Create Account</h1>
            <p className="text-gray-300 text-sm md:text-base">Become part of the Victorian Luxuries family</p>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8">

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 rounded px-4 py-3 text-sm mb-4">
                {serverError}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 rounded px-4 py-3 text-sm mb-4">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Full Name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
{serverError && serverError.includes('already exists') && (
  <p className="text-red-400 text-xs mt-1">{serverError}</p>
)}
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 pr-12 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition">
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <CriteriaBox met={criteria.uppercase} label="Uppercase letter" />
                    <CriteriaBox met={criteria.lowercase} label="Lowercase letter" />
                    <CriteriaBox met={criteria.numberOrSymbol} label="Number or symbol" />
                    <CriteriaBox met={criteria.minLength} label="8+ characters" />
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 pr-12 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${errors.confirm ? 'border-red-500' : 'border-gray-600'}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition">
                    {showConfirm ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
              </div>

              {/* Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-gray-400 text-xs md:text-sm text-center mt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-yellow-500 hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register