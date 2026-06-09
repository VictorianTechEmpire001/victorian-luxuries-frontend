import HeroSection from '../Components/HeroSection'
import TrustBadges from '../Components/TrustBadges'
import { Link } from 'react-router-dom'
import products from '../Data/products'
import { useState } from 'react'

const API_URL = 'https://victorian-luxuries-backend.onrender.com'

const collections = [
  { name: "Men's Watches", category: "mens", image: "/src/assets/images/watches/mens/mens-1.jpg" },
  { name: "Women's Watches", category: "womens", image: "/src/assets/images/watches/womens/womens-1.jpg" },
  { name: "Luxury Watches", category: "luxury", image: "/src/assets/images/watches/luxury/luxury-1.jpg" },
  { name: "Smartwatches", category: "smart", image: "/src/assets/images/watches/smart/smart-1.jpg" },
  { name: "Kids Watches", category: "kids", image: "/src/assets/images/watches/kids/kids-1.jpg" },
]

const Home = () => {
  const bestsellers = products.filter(p => p.badge === "bestseller").slice(0, 4)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [serverError, setServerError] = useState('')

  const handleSubscribe = async () => {
    setEmailError('')
    setServerError('')

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email address.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setServerError('This email is already subscribed! 👑')
        } else {
          setServerError(data.message || 'Subscription failed. Please try again.')
        }
        return
      }

      setSubscribed(true)
      setEmail('')

    } catch (error) {
      setServerError('Cannot connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black">
      <HeroSection />
      <TrustBadges />

      {/* Featured Collections */}
      <section className="py-10 md:py-14 lg:py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-white font-serif font-bold text-center text-2xl md:text-3xl lg:text-4xl mb-2">
          Featured Collections
        </h2>
        <p className="text-gray-400 text-center text-sm md:text-base mb-8 md:mb-12">
          Explore our curated selection of luxury timepieces
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {collections.map((col) => (
            <Link
              to={`/collections/${col.category}`}
              key={col.category}
              className="relative rounded-lg overflow-hidden group cursor-pointer border-2 border-transparent hover:border-yellow-500 transition duration-300">
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-20 transition duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                <p className="text-white font-semibold text-xs md:text-sm lg:text-base text-center">
                  {col.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop Bestsellers */}
      <section className="py-10 md:py-14 lg:py-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-white font-serif font-bold text-center text-2xl md:text-3xl lg:text-4xl mb-2">
          Shop Bestsellers
        </h2>
        <p className="text-gray-400 text-center text-sm md:text-base mb-8 md:mb-12">
          Our most loved luxury timepieces
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {bestsellers.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-zinc-900 rounded-lg overflow-hidden group cursor-pointer border-2 border-transparent hover:border-yellow-500 transition duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-36 md:h-44 lg:h-52 object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase">
                  {product.badge}
                </span>
              </div>
              <div className="p-2 md:p-3 lg:p-4">
                <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base mb-1 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-bold text-xs md:text-sm lg:text-base">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 line-through text-xs">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-8 md:mt-10">
          <Link to="/bestsellers">
            <button className="border border-yellow-500 text-yellow-500 font-semibold rounded px-6 py-2.5 text-sm md:px-8 md:py-3 md:text-base hover:bg-yellow-500 hover:text-black transition">
              View All Watches →
            </button>
          </Link>
        </div>
      </section>

      {/* New Arrivals Newsletter */}
      <section className="relative py-16 md:py-20 lg:py-24 overflow-hidden">

        <img
          src="/src/assets/images/watches/hero.jpg"
          alt="New Arrivals"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-75"></div>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-500"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

            {/* Left Text */}
            <div className="text-center md:text-left">
              <p className="text-yellow-500 text-xs md:text-sm uppercase tracking-widest mb-2">
                Stay Updated
              </p>
              <h2 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-2">
                New Arrivals
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-sm">
                Explore the Latest in Luxury Timepieces. Subscribe and be the first to know.
              </p>
              <div className="flex flex-col gap-1 mt-4">
                <p className="text-gray-400 text-xs md:text-sm">✓ Exclusive member deals</p>
                <p className="text-gray-400 text-xs md:text-sm">✓ New collection alerts</p>
                <p className="text-gray-400 text-xs md:text-sm">✓ No spam, unsubscribe anytime</p>
              </div>
            </div>

            {/* Right Form */}
            <div className="w-full md:w-auto">
              {!subscribed ? (
                <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-6 md:p-8 w-full md:w-96">
                  <h3 className="text-white font-semibold text-base md:text-lg mb-4">
                    Subscribe Now
                  </h3>

                  {/* Server Error */}
                  {serverError && (
                    <div className={`rounded px-4 py-3 text-sm mb-3 ${
                      serverError.includes('already subscribed')
                        ? 'bg-yellow-500/10 border border-yellow-500 text-yellow-400'
                        : 'bg-red-500/10 border border-red-500 text-red-400'
                    }`}>
                      {serverError}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailError('')
                          setServerError('')
                        }}
                        spellCheck="false"
                        placeholder="Enter your email address"
                        className={`w-full bg-zinc-900 border text-white placeholder-gray-500 rounded px-4 py-3 text-sm md:text-base focus:outline-none focus:border-yellow-500 transition ${
                          emailError ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {emailError && (
                        <p className="text-red-400 text-xs mt-1">{emailError}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                  </div>
                  <p className="text-gray-500 text-xs mt-3 text-center">
                    Join 10,000+ luxury watch enthusiasts
                  </p>
                </div>
              ) : (
                <div className="bg-black/40 backdrop-blur-sm border border-yellow-500 rounded-lg p-8 w-full md:w-96 text-center">
                  <div className="w-16 h-16 bg-yellow-500/10 border-2 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-yellow-500 text-3xl">✓</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    You're In! 
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Welcome to Victorian Luxuries. You'll be the first to know about our new luxury arrivals!
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
      </section>

    </div>
  )
}

export default Home