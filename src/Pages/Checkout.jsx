import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../Context/CartContext'

const API_URL = 'https://victorian-luxuries-backend.onrender.com'

const Checkout = () => {
  const { cartItems, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: ''
  })
  const [errors, setErrors] = useState({})
  const [ordered, setOrdered] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)

  // Get logged in user and auto-fill form
  useEffect(() => {
    const savedUser = localStorage.getItem('victorian_user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setForm(prev => ({
        ...prev,
        name: parsedUser.name || '',
        email: parsedUser.email || '',
      }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    setServerError('')
  }

  const handleOrder = async () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true)
      // Save checkout as redirect destination
      localStorage.setItem('victorian_redirect', '/checkout')
      return
    }

    // Validate form
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your full name.'
    if (!form.email.trim()) newErrors.email = 'Please enter your email address.'
    if (!form.phone.trim()) newErrors.phone = 'Please enter your phone number.'
    else if (!/^[\d\s\+\-]{7,15}$/.test(form.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number.'
    }
    if (!form.address.trim()) newErrors.address = 'Please enter your delivery address.'
    if (!form.city.trim()) newErrors.city = 'Please enter your city.'
    if (!form.state.trim()) newErrors.state = 'Please enter your state.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      const token = localStorage.getItem('victorian_token')
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || 'Failed to place order. Please try again.')
        return
      }

      setOrderId(data.orderId)
      clearCart()
      setOrdered(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error) {
      setServerError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success Screen
  if (ordered) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-yellow-500 text-4xl">✓</span>
          </div>
          <h2 className="text-white font-serif font-bold text-2xl md:text-3xl mb-3">
            Order Placed! 
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-2">
            Thank you <span className="text-yellow-500 font-semibold">{form.name}</span>!
          </p>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Your order will be delivered to <span className="text-white">{form.city}, {form.state}</span>.
          </p>
          {orderId && (
            <div className="bg-zinc-900 border border-yellow-500/30 rounded-lg px-4 py-3 mb-6">
              <p className="text-gray-400 text-xs mb-1">Order ID</p>
              <p className="text-yellow-500 text-sm font-mono">{orderId}</p>
            </div>
          )}
          <p className="text-gray-500 text-xs md:text-sm mb-8">
            We will contact you shortly to confirm your order.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-yellow-500 text-black font-semibold rounded px-8 py-3 text-sm md:text-base hover:bg-yellow-600 transition">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen py-10 md:py-14 px-4 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-8">
          Checkout
        </h1>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 rounded px-4 py-3 text-sm mb-6">
            {serverError}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Delivery Form */}
          <div className="flex-1">
            <h2 className="text-yellow-500 font-semibold text-lg md:text-xl mb-4">
              Delivery Information
            </h2>

            {/* Logged in badge */}
            {user && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 mb-4 flex items-center gap-2">
                <span className="text-yellow-500 text-sm">✓</span>
                <p className="text-yellow-500 text-xs md:text-sm">
                  Logged in as <span className="font-semibold">{user.name}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">

              {/* Full Name */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Full Name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Email Address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  spellCheck="false"
                  placeholder="Enter your email"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Phone Number</label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                    errors.phone ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="text-gray-300 text-xs md:text-sm mb-1 block">Delivery Address</label>
                <input
                  type="text" name="address" value={form.address} onChange={handleChange}
                  placeholder="Enter your delivery address"
                  className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                    errors.address ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-xs md:text-sm mb-1 block">City</label>
                  <input
                    type="text" name="city" value={form.city} onChange={handleChange}
                    placeholder="Your city"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                      errors.city ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-gray-300 text-xs md:text-sm mb-1 block">State</label>
                  <input
                    type="text" name="state" value={form.state} onChange={handleChange}
                    placeholder="Your state"
                    className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                      errors.state ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <h2 className="text-yellow-500 font-semibold text-lg md:text-xl mb-4">
              Order Summary
            </h2>
            <div className="bg-zinc-900 rounded-lg p-6 border border-gray-800">

              <div className="flex flex-col gap-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs md:text-sm truncate">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-yellow-500 text-xs md:text-sm font-bold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 flex flex-col gap-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Shipping</span>
                  <span className="text-green-400 text-sm font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-bold text-sm md:text-base">Total</span>
                  <span className="text-yellow-500 font-bold text-sm md:text-base">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOrder}
                disabled={loading}
                className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <Link to="/cart">
                <button
                  type="button"
                  className="w-full border border-gray-600 text-gray-400 rounded px-6 py-3 text-sm md:text-base hover:border-yellow-500 hover:text-yellow-500 transition mt-3">
                  Back to Cart
                </button>
              </Link>

            </div>
          </div>

        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">

            <div className="w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-500 text-2xl">🔐</span>
            </div>

            <h3 className="text-white font-serif font-bold text-xl mb-2">
              Login Required
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Please login or create an account to complete your order. Your cart items will be saved.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm hover:bg-yellow-600 transition">
                Login to My Account
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full border border-yellow-500 text-yellow-500 font-semibold rounded px-6 py-3 text-sm hover:bg-yellow-500 hover:text-black transition">
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 text-sm hover:text-gray-300 transition mt-1">
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Checkout