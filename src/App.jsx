import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './Context/CartContext'
import Navbar from './Components/Navbar'
import ScrollToTop from './Components/ScrollToTop'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import Collections from './Pages/Collections'
import Bestsellers from './Pages/Bestsellers'
import ProductDetail from './Pages/ProductDetail'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Contact from './Pages/Contact'
import Admin from './Pages/Admin'

function App() {
  const [user, setUser] = useState(null)

  // Check if user is already logged in on page load/refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('victorian_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('victorian_user')
    localStorage.removeItem('victorian_token')
    setUser(null)
  }

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Navbar user={user} onLogout={handleLogout} />
        <div className="pt-16 md:pt-20 bg-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/bestsellers" element={<Bestsellers />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </CartProvider>
  )
}

export default App