import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { useCart } from '../Context/CartContext'

const Cart = () => {
  const { cartItems, increase, decrease, removeItem, total, totalItems } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-white font-serif font-bold text-2xl md:text-3xl mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8">
            Discover our luxury timepieces and add them to your cart
          </p>
          <Link to="/">
            <button className="bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen py-10 md:py-14 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-2">
          Your Cart
        </h1>
        <p className="text-gray-400 text-sm md:text-base mb-8">
          {totalItems} items in your cart
        </p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-zinc-900 rounded-lg p-4 flex items-center gap-4 border border-gray-800">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm md:text-base truncate">{item.name}</h3>
                  <p className="text-yellow-500 font-bold text-sm md:text-base">${item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => decrease(item.id)}
                    className="bg-zinc-700 text-white w-7 h-7 rounded flex items-center justify-center hover:bg-yellow-500 hover:text-black transition text-sm">
                    -
                  </button>
                  <span className="text-white text-sm md:text-base w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increase(item.id)}
                    className="bg-zinc-700 text-white w-7 h-7 rounded flex items-center justify-center hover:bg-yellow-500 hover:text-black transition text-sm">
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-500 hover:text-red-500 transition ml-1">
                    <FaTrash className="text-sm md:text-base" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-72">
            <div className="bg-zinc-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-white font-semibold text-lg md:text-xl mb-6">Order Summary</h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm md:text-base">Subtotal</span>
                  <span className="text-white text-sm md:text-base">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm md:text-base">Shipping</span>
                  <span className="text-green-400 text-sm md:text-base">Free</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between">
                  <span className="text-white font-bold text-sm md:text-base">Total</span>
                  <span className="text-yellow-500 font-bold text-sm md:text-base">${total.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition">
                  Proceed to Checkout
                </button>
              </Link>

              <Link to="/">
                <button className="w-full border border-gray-600 text-gray-400 rounded px-6 py-3 text-sm md:text-base hover:border-yellow-500 hover:text-yellow-500 transition mt-3">
                  Continue Shopping
                </button>
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart