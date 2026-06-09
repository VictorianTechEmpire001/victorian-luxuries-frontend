import { useState, useEffect, useCallback } from 'react'
import { GiPocketWatch } from 'react-icons/gi'

const API_URL = 'https://victorian-luxuries-backend.onrender.com'
const ADMIN_PASSWORD = 'Victor'
const SESSION_DURATION = 24 * 60 * 60 * 1000
const INACTIVITY_LIMIT = 30 * 60 * 1000
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 30 * 60 * 1000
const FAKE_DELAY = 3 * 1000

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')
  const [showPassword, setShowPassword] = useState(false)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [messages, setMessages] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalUsers: 0,
    totalSubscribers: 0, unreadMessages: 0, totalProducts: 0,
  })
  const [openStatusId, setOpenStatusId] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showBanConfirm, setShowBanConfirm] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', originalPrice: '',
    category: '', badge: '', description: '', image: ''
  })
  const [productErrors, setProductErrors] = useState({})
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')
  useEffect(() => {
    const session = localStorage.getItem('victorian_admin_session')
    if (session) {
      const { expiry, lastActivity } = JSON.parse(session)
      const now = Date.now()
      if (now < expiry && now - lastActivity < INACTIVITY_LIMIT) {
        setIsAuthenticated(true)
        updateActivity()
      } else {
        localStorage.removeItem('victorian_admin_session')
      }
    }
  }, [])

  const updateActivity = useCallback(() => {
    const session = localStorage.getItem('victorian_admin_session')
    if (session) {
      const parsed = JSON.parse(session)
      localStorage.setItem('victorian_admin_session', JSON.stringify({
        ...parsed, lastActivity: Date.now()
      }))
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, updateActivity))
    const inactivityCheck = setInterval(() => {
      const session = localStorage.getItem('victorian_admin_session')
      if (session) {
        const { lastActivity } = JSON.parse(session)
        if (Date.now() - lastActivity > INACTIVITY_LIMIT) handleLogout()
      }
    }, 60000)
    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity))
      clearInterval(inactivityCheck)
    }
  }, [isAuthenticated, updateActivity])

  const fetchAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem('victorian_token') || ''
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const [ordersRes, usersRes, subsRes, msgsRes, prodsRes] = await Promise.all([
        fetch(`${API_URL}/api/orders`, { headers }),
        fetch(`${API_URL}/api/auth/users`, { headers }),
        fetch(`${API_URL}/api/subscribers`, { headers }),
        fetch(`${API_URL}/api/contact`, { headers }),
        fetch(`${API_URL}/api/products`),
      ])
      const [ordersData, usersData, subsData, msgsData, prodsData] = await Promise.all([
        ordersRes.json(), usersRes.json(), subsRes.json(),
        msgsRes.json(), prodsRes.json(),
      ])
      if (ordersData.success) setOrders(ordersData.orders)
      if (usersData.success) setUsers(usersData.users)
      if (subsData.success) setSubscribers(subsData.subscribers)
      if (msgsData.success) setMessages(msgsData.messages)
      if (prodsData.success) setProducts(prodsData.products)
      setStats({
        totalRevenue: ordersData.totalRevenue || 0,
        totalOrders: ordersData.count || 0,
        totalUsers: usersData.count || 0,
        totalSubscribers: subsData.count || 0,
        unreadMessages: msgsData.unreadCount || 0,
        totalProducts: prodsData.count || 0,
      })
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    fetchAllData()
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchAllData])

  const handleLogin = async () => {
    const lockout = localStorage.getItem('victorian_admin_lockout')
    if (lockout) {
      const lockoutTime = parseInt(lockout)
      const remaining = Math.ceil((lockoutTime - Date.now()) / 60000)
      if (Date.now() < lockoutTime) {
        setAuthError(`Admin Dashboard locked. Try again in ${remaining} minutes.`)
        return
      } else {
        localStorage.removeItem('victorian_admin_lockout')
        localStorage.removeItem('victorian_admin_attempts')
      }
    }
    if (!password.trim()) {
      setAuthError('Please enter the Admin Dashboard password.')
      return
    }
    setIsChecking(true)
    setAuthError('')
    await new Promise(resolve => setTimeout(resolve, FAKE_DELAY))
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('victorian_admin_session', JSON.stringify({
        expiry: Date.now() + SESSION_DURATION,
        lastActivity: Date.now()
      }))
      localStorage.removeItem('victorian_admin_attempts')
      localStorage.removeItem('victorian_admin_lockout')
      setIsChecking(false)
      setIsAuthenticated(true)
    } else {
      const attempts = parseInt(localStorage.getItem('victorian_admin_attempts') || '0') + 1
      localStorage.setItem('victorian_admin_attempts', attempts.toString())
      if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem('victorian_admin_lockout', (Date.now() + LOCKOUT_DURATION).toString())
        localStorage.removeItem('victorian_admin_attempts')
        setAuthError('Access Denied. Admin Dashboard locked for 30 minutes.')
      } else {
        setAuthError('Access Denied.')
      }
      setIsChecking(false)
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('victorian_admin_session')
    setIsAuthenticated(false)
    setPassword('')
  }
  const updateOrderStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('victorian_token') || ''
    await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setOpenStatusId(null)
    setActionMessage(`Order status updated to "${status}" 👑`)
    setTimeout(() => setActionMessage(''), 3000)
  } catch (error) {
    setActionMessage('Failed to update order status')
  }
}
  const deleteOrder = async (id) => {
    setActionLoading(true)
    try {
      const token = localStorage.getItem('victorian_token') || ''
      await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setOrders(prev => prev.filter(o => o.id !== id))
      setStats(prev => ({ ...prev, totalOrders: prev.totalOrders - 1 }))
      setActionMessage('Order deleted successfully')
      setTimeout(() => setActionMessage(''), 3000)
    } catch (error) {
      setActionMessage('Failed to delete order')
    } finally {
      setActionLoading(false)
      setShowDeleteConfirm(null)
    }
  }

  const deleteSubscriber = async (id) => {
    setActionLoading(true)
    try {
      const token = localStorage.getItem('victorian_token') || ''
      await fetch(`${API_URL}/api/subscribers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setSubscribers(prev => prev.filter(s => s.id !== id))
      setStats(prev => ({ ...prev, totalSubscribers: prev.totalSubscribers - 1 }))
      setActionMessage('Subscriber removed successfully')
      setTimeout(() => setActionMessage(''), 3000)
    } catch (error) {
      setActionMessage('Failed to remove subscriber')
    } finally {
      setActionLoading(false)
      setShowDeleteConfirm(null)
    }
  }

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('victorian_token') || ''
      await fetch(`${API_URL}/api/contact/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
      setStats(prev => ({ ...prev, unreadMessages: prev.unreadMessages - 1 }))
    } catch (error) {
      console.error('Mark as read error:', error)
    }
  }

  const deleteMessage = async (id) => {
    setActionLoading(true)
    try {
      const token = localStorage.getItem('victorian_token') || ''
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setMessages(prev => prev.filter(m => m.id !== id))
      setActionMessage('Message deleted successfully')
      setTimeout(() => setActionMessage(''), 3000)
    } catch (error) {
      setActionMessage('Failed to delete message')
    } finally {
      setActionLoading(false)
      setShowDeleteConfirm(null)
    }
  }

  const handleAddProduct = async () => {
    const newErrors = {}
    if (!newProduct.name.trim()) newErrors.name = 'Product name is required'
    if (!newProduct.price) newErrors.price = 'Price is required'
    if (!newProduct.category) newErrors.category = 'Category is required'
    if (Object.keys(newErrors).length > 0) {
      setProductErrors(newErrors)
      return
    }
    setActionLoading(true)
    try {
      const token = localStorage.getItem('victorian_token') || ''
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price),
        })
      })
      const data = await response.json()
      if (data.success) {
        setProducts(prev => [data.product, ...prev])
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }))
        setShowAddProduct(false)
        setNewProduct({ name: '', price: '', originalPrice: '', category: '', badge: '', description: '', image: '' })
        setActionMessage('Product added successfully! ')
        setTimeout(() => setActionMessage(''), 3000)
      }
    } catch (error) {
      setActionMessage('Failed to add product')
    } finally {
      setActionLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    setActionLoading(true)
    try {
      const token = localStorage.getItem('victorian_token') || ''
      await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setProducts(prev => prev.filter(p => p.id !== id))
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }))
      setActionMessage('Product deleted successfully')
      setTimeout(() => setActionMessage(''), 3000)
    } catch (error) {
      setActionMessage('Failed to delete product')
    } finally {
      setActionLoading(false)
      setShowDeleteConfirm(null)
    }
  }

  const banUser = async (id) => {
    setActionLoading(true)
    try {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, banned: true } : u))
      setActionMessage('User banned')
      setTimeout(() => setActionMessage(''), 3000)
    } catch (error) {
      setActionMessage('Failed to ban user')
    } finally {
      setActionLoading(false)
      setShowBanConfirm(null)
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

  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <GiPocketWatch className="text-yellow-500 text-5xl mx-auto mb-3" />
            <h1 className="text-white font-serif font-bold text-2xl mb-1">Victorian Luxuries</h1>
            <p className="text-yellow-500 text-xs uppercase tracking-widest">Admin Dashboard Access</p>
          </div>
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-8">
            {authError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 rounded px-4 py-3 text-sm mb-4 text-center">
                {authError}
              </div>
            )}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-300 text-xs mb-1 block uppercase tracking-wider">
                  Admin Dashboard Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && !isChecking && handleLogin()}
                    placeholder="Enter Admin Dashboard password"
                    className="w-full bg-black border border-gray-600 text-white placeholder-gray-600 rounded px-4 py-3 pr-12 text-sm focus:outline-none focus:border-yellow-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition">
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogin}
                disabled={isChecking}
                className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {isChecking ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Enter Admin Dashboard'}
              </button>
            </div>
          </div>
          <p className="text-gray-700 text-xs text-center mt-6">
            Victorian Luxuries Admin — Authorized Access Only
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-black min-h-screen py-10 md:py-14 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl">
              My Admin Dashboard 
            </h1>
            <p className="text-gray-400 text-sm mt-1">Victorian Luxuries Admin Dashboard</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-gray-600 text-gray-400 rounded px-4 py-2 text-sm hover:border-red-500 hover:text-red-400 transition">
            Exit Admin Dashboard 
          </button>
        </div>

        {actionMessage && (
          <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-400 rounded px-4 py-3 text-sm mb-6">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          <div className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">💰 Revenue</p>
            <p className="text-yellow-500 font-bold text-lg md:text-xl">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">👑 Orders</p>
            <p className="text-yellow-500 font-bold text-lg md:text-xl">{stats.totalOrders}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">👥 Users</p>
            <p className="text-yellow-500 font-bold text-lg md:text-xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">📧 Subscribers</p>
            <p className="text-yellow-500 font-bold text-lg md:text-xl">{stats.totalSubscribers}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">💬 Unread</p>
            <p className="text-yellow-500 font-bold text-lg md:text-xl">{stats.unreadMessages}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-xs mb-1">📦 Products</p>
            <p className="text-yellow-500 font-bold text-lg md:text-xl">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 mb-6 border-b border-gray-800 overflow-x-auto">
          {['orders', 'products', 'users', 'subscribers', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-xs md:text-sm font-semibold transition whitespace-nowrap capitalize ${
                activeTab === tab
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="flex flex-col gap-3">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-zinc-900 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
  <p className="text-white font-semibold text-sm">{order.name}</p>
  <div className="relative">
    <button
      type="button"
      onClick={() => setOpenStatusId(openStatusId === order.id ? null : order.id)}
      className={`text-xs px-2 py-0.5 rounded capitalize border font-semibold transition ${
        order.status === 'delivered' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
        order.status === 'shipped' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
        order.status === 'confirmed' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
        order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
        'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
      }`}>
      {order.status} ▾
    </button>
    {openStatusId === order.id && (
      <div className="absolute top-6 left-0 bg-zinc-800 border border-gray-700 rounded-lg shadow-xl z-50 w-32">
        {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            type="button"
            onClick={() => updateOrderStatus(order.id, status)}
            className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-zinc-700 transition first:rounded-t-lg last:rounded-b-lg ${
              order.status === status ? 'text-yellow-500 font-semibold' : 'text-gray-300'
            }`}>
            {status}
          </button>
        ))}
      </div>
    )}
  </div>
</div>
                  
                  
                      <p className="text-gray-400 text-xs">{order.email}</p>
                      <p className="text-gray-400 text-xs">{order.phone}</p>
                      <p className="text-gray-400 text-xs">{order.address}, {order.city}, {order.state}</p>
                      <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {order.items?.map((item, i) => (
                          <span key={i} className="text-xs text-gray-400 bg-zinc-800 px-2 py-0.5 rounded">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-yellow-500 font-bold text-sm">${order.total?.toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm({ type: 'order', id: order.id })}
                        className="text-gray-600 hover:text-red-500 transition text-xs mt-2">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setShowAddProduct(true)}
                className="bg-yellow-500 text-black font-semibold rounded px-4 py-2 text-sm hover:bg-yellow-600 transition">
                + Add Product
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No products found</p>
              ) : (
                products.map(product => (
                  <div key={product.id} className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4 border border-gray-800">
                    <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">{product.name}</h3>
                      <p className="text-gray-400 text-xs capitalize">{product.category}</p>
                      <p className="text-yellow-500 font-bold text-xs">${product.price?.toLocaleString()}</p>
                    </div>
                    {product.badge && (
                      <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase flex-shrink-0">
                        {product.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm({ type: 'product', id: product.id })}
                      className="text-gray-600 hover:text-red-500 transition text-xs flex-shrink-0">
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="flex flex-col gap-3">
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No users yet</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4 border border-gray-800">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-sm">
                      {user.name ? user.name[0].toUpperCase() : '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                    <p className="text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  {user.banned ? (
                    <span className="text-red-500 text-xs font-semibold flex-shrink-0">Banned</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowBanConfirm(user.id)}
                      className="text-gray-600 hover:text-red-500 transition text-xs flex-shrink-0">
                      Ban
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="flex flex-col gap-3">
            {subscribers.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No subscribers yet</p>
            ) : (
              subscribers.map(sub => (
                <div key={sub.id} className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4 border border-gray-800">
                  <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-500 font-bold text-sm">
                      {sub.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{sub.email}</p>
                    <p className="text-gray-500 text-xs">{new Date(sub.subscribedAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm({ type: 'subscriber', id: sub.id })}
                    className="text-gray-600 hover:text-red-500 transition text-xs flex-shrink-0">
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No messages yet</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`bg-zinc-900 rounded-lg p-4 border transition ${
                  msg.read ? 'border-gray-800' : 'border-yellow-500/30'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold text-sm">{msg.name}</p>
                        {!msg.read && (
                          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">{msg.email}</p>
                      <p className="text-yellow-500 text-xs mt-1">{msg.subject}</p>
                      <p className="text-gray-300 text-sm mt-2">{msg.message}</p>
                      <p className="text-gray-600 text-xs mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {!msg.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(msg.id)}
                          className="text-yellow-500 hover:text-yellow-400 transition text-xs">
                          Mark Read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm({ type: 'message', id: msg.id })}
                        className="text-gray-600 hover:text-red-500 transition text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-8 max-w-sm w-full text-center">
            <h3 className="text-white font-serif font-bold text-xl mb-2">Confirm Delete</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-600 text-gray-400 rounded px-4 py-2 text-sm hover:border-white hover:text-white transition">
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => {
                  if (showDeleteConfirm.type === 'order') deleteOrder(showDeleteConfirm.id)
                  if (showDeleteConfirm.type === 'product') deleteProduct(showDeleteConfirm.id)
                  if (showDeleteConfirm.type === 'subscriber') deleteSubscriber(showDeleteConfirm.id)
                  if (showDeleteConfirm.type === 'message') deleteMessage(showDeleteConfirm.id)
                }}
                className="flex-1 bg-red-500 text-white rounded px-4 py-2 text-sm hover:bg-red-600 transition disabled:opacity-50">
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBanConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-8 max-w-sm w-full text-center">
            <h3 className="text-white font-serif font-bold text-xl mb-2">Ban User?</h3>
            <p className="text-gray-400 text-sm mb-6">This user will be banned from the website.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowBanConfirm(null)}
                className="flex-1 border border-gray-600 text-gray-400 rounded px-4 py-2 text-sm hover:border-white hover:text-white transition">
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => banUser(showBanConfirm)}
                className="flex-1 bg-red-500 text-white rounded px-4 py-2 text-sm hover:bg-red-600 transition disabled:opacity-50">
                {actionLoading ? 'Banning...' : 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6 max-w-md w-full max-h-screen overflow-y-auto">
            <h3 className="text-white font-serif font-bold text-xl mb-6">Add New Product</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Royal Chronograph"
                  className={`w-full bg-black border text-white placeholder-gray-600 rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition ${
                    productErrors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {productErrors.name && <p className="text-red-400 text-xs mt-1">{productErrors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Price *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="4999"
                    className={`w-full bg-black border text-white placeholder-gray-600 rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition ${
                      productErrors.price ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {productErrors.price && <p className="text-red-400 text-xs mt-1">{productErrors.price}</p>}
                </div>
                <div>
                  <label className="text-gray-300 text-xs mb-1 block">Original Price</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={e => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="6999"
                    className="w-full bg-black border border-gray-600 text-white placeholder-gray-600 rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Category *</label>
                <select
                  value={newProduct.category}
                  onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full bg-black border text-white rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition ${
                    productErrors.category ? 'border-red-500' : 'border-gray-600'
                  }`}>
                  <option value="">Select category</option>
                  <option value="mens">Men's Watches</option>
                  <option value="womens">Women's Watches</option>
                  <option value="luxury">Luxury Watches</option>
                  <option value="smart">Smartwatches</option>
                  <option value="kids">Kids Watches</option>
                </select>
                {productErrors.category && <p className="text-red-400 text-xs mt-1">{productErrors.category}</p>}
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Badge</label>
                <select
                  value={newProduct.badge}
                  onChange={e => setNewProduct(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full bg-black border border-gray-600 text-white rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition">
                  <option value="">No badge</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="sale">Sale</option>
                  <option value="new">New</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Image URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={e => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="/src/assets/images/watches/mens/mens-1.jpg"
                  className="w-full bg-black border border-gray-600 text-white placeholder-gray-600 rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-300 text-xs mb-1 block">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description..."
                  rows={3}
                  className="w-full bg-black border border-gray-600 text-white placeholder-gray-600 rounded px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition resize-none"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProduct(false)
                    setProductErrors({})
                    setNewProduct({ name: '', price: '', originalPrice: '', category: '', badge: '', description: '', image: '' })
                  }}
                  className="flex-1 border border-gray-600 text-gray-400 rounded px-4 py-3 text-sm hover:border-white hover:text-white transition">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={actionLoading}
                  className="flex-1 bg-yellow-500 text-black font-semibold rounded px-4 py-3 text-sm hover:bg-yellow-600 transition disabled:opacity-50">
                  {actionLoading ? 'Adding...' : 'Add Product '}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Admin
      