import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Utils/firebase'
import loginBg from '../assets/images/watches/hero.jpg'

const API_URL = 'http://localhost:5000'

const Login = ({ setUser }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.email.trim()) newErrors.email = 'Please enter your email address.'
    if (!form.password.trim()) newErrors.password = 'Please enter your password.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      )

      const idToken = await userCredential.user.getIdToken()

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Login failed. Please try again.')
        return
      }

      // Save to localStorage
      localStorage.setItem('victorian_user', JSON.stringify(data.user))
      localStorage.setItem('victorian_token', idToken)

      // Update App state — navbar updates instantly
      setUser(data.user)

      // Check if there's a saved redirect
const redirect = localStorage.getItem('victorian_redirect')
if (redirect) {
  localStorage.removeItem('victorian_redirect')
  navigate(redirect)
} else {
  navigate('/')
}

    } catch (error) {
      console.error('Login error:', error.code)
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        setServerError('Invalid email or password. Please try again.')
      } else if (error.code === 'auth/too-many-requests') {
        setServerError('Too many failed attempts. Please try again later.')
      } else if (error.code === 'auth/network-request-failed') {
        setServerError('Network error. Please check your connection.')
      } else {
        setServerError('Login failed. Please try again.')
      }
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

  return (
    <div className="relative min-h-screen">
      <img src={loginBg} alt="Login Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black opacity-75"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <p className="text-yellow-500 text-xs md:text-sm uppercase tracking-widest mb-2">Welcome Back</p>
            <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-3">Sign In</h1>
            <p className="text-gray-300 text-sm md:text-base">Access your Victorian Luxuries account</p>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8">

            {serverError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 rounded px-4 py-3 text-sm mb-4">
                {serverError}
              </div>
            )}

            <div className="flex flex-col gap-4">

              {/* Email */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  spellCheck="false"
                  placeholder="Enter your email"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 pr-12 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                      errors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition">
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="text-gray-400 text-xs md:text-sm text-center mt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-yellow-500 hover:underline">Create Account</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login