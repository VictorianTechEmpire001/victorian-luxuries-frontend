import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GiPocketWatch } from 'react-icons/gi'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaShoppingCart, FaChevronDown, FaUserCircle } from 'react-icons/fa'
import { useCart } from '../Context/CartContext'

const collections = [
  { name: "Men's Watches", category: "mens" },
  { name: "Women's Watches", category: "womens" },
  { name: "Luxury Watches", category: "luxury" },
  { name: "Smartwatches", category: "smart" },
  { name: "Kids Watches", category: "kids" },
]

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    setUserMenuOpen(false)
    setIsOpen(false)
    navigate('/')
  }

  return (
    <nav className="bg-black text-white fixed w-full top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GiPocketWatch className="text-yellow-500 text-2xl md:text-3xl lg:text-4xl" />
            <span className="text-white font-serif text-base md:text-lg lg:text-xl">Victorian</span>
            <span className="text-yellow-500 font-serif font-bold text-base md:text-lg lg:text-xl">LUXURIES</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/" className="hover:text-yellow-500 transition text-sm lg:text-base">Home</Link>

            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center gap-1 hover:text-yellow-500 transition text-sm lg:text-base">
                Shop
                <FaChevronDown className={`text-xs transition duration-300 ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopOpen && (
                <div className="absolute top-8 left-0 bg-zinc-900 border border-gray-700 rounded-lg shadow-xl w-48 z-50">
                  {collections.map((col) => (
                    <Link
                      key={col.category}
                      to={`/collections/${col.category}`}
                      onClick={() => setShopOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-300 hover:text-yellow-500 hover:bg-zinc-800 transition first:rounded-t-lg last:rounded-b-lg">
                      {col.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/bestsellers" className="hover:text-yellow-500 transition text-sm lg:text-base">Bestsellers</Link>
            <Link to="/contact" className="hover:text-yellow-500 transition text-sm lg:text-base">Contact</Link>

            {/* Cart */}
            <Link to="/cart" className="relative hover:text-yellow-500 transition">
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-500 text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:text-yellow-500 transition text-sm lg:text-base">
                  <FaUserCircle className="text-yellow-500 text-xl" />
                  <span className="text-yellow-500 font-semibold">
                    {user.name ? user.name.split(' ')[0] : 'Account'}
                  </span>
                  <FaChevronDown className={`text-xs transition duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-10 right-0 bg-zinc-900 border border-gray-700 rounded-lg shadow-xl w-44 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition rounded-b-lg">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-500 text-black px-3 py-1.5 lg:px-4 lg:py-2 rounded text-sm lg:text-base font-semibold hover:bg-yellow-600 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/cart" className="relative text-white">
              <FaShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-yellow-500 text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button className="text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4 px-2">
            <Link to="/" className="hover:text-yellow-500 transition" onClick={() => setIsOpen(false)}>Home</Link>

            <div>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center gap-2 hover:text-yellow-500 transition w-full">
                Shop
                <FaChevronDown className={`text-xs transition duration-300 ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopOpen && (
                <div className="flex flex-col gap-2 mt-2 pl-4 border-l border-yellow-500">
                  {collections.map((col) => (
                    <Link
                      key={col.category}
                      to={`/collections/${col.category}`}
                      onClick={() => { setIsOpen(false); setShopOpen(false) }}
                      className="text-gray-400 hover:text-yellow-500 transition text-sm">
                      {col.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/bestsellers" className="hover:text-yellow-500 transition" onClick={() => setIsOpen(false)}>Bestsellers</Link>
            <Link to="/contact" className="hover:text-yellow-500 transition" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/cart" className="hover:text-yellow-500 transition" onClick={() => setIsOpen(false)}>Cart</Link>

            {/* Mobile Auth */}
            {user ? (
              <div className="flex flex-col gap-2 border-t border-gray-700 pt-3">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-yellow-500 text-xl" />
                  <div>
                    <p className="text-white text-sm font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 text-sm text-left hover:text-red-300 transition">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold w-fit hover:bg-yellow-600 transition"
                onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}
          </div>
        )}

      </div>
    </nav>
  )
}

export default Navbar