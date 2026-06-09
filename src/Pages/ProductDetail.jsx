import { useParams, Link } from 'react-router-dom'
import products from '../Data/products'
import { useCart } from '../Context/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Product not found</h2>
          <Link to="/" className="text-yellow-500 hover:underline">Back to Home</Link>
        </div>
      </div>
    )
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="bg-black min-h-screen py-10 md:py-14 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">

        <Link
          to={`/collections/${product.category}`}
          className="text-yellow-500 hover:underline text-sm md:text-base mb-6 inline-block">
          ← Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">

          <div className="relative rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-72 md:h-96 lg:h-[500px] object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded uppercase">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-yellow-500 text-xs md:text-sm uppercase tracking-widest mb-2">
              {product.category} Collection
            </p>
            <h1 className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl mb-4">
              {product.name}
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-yellow-500 font-bold text-2xl md:text-3xl">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-gray-500 line-through text-lg md:text-xl">
                ${product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-green-800 text-green-300 text-xs px-2 py-1 rounded">
                Save ${(product.originalPrice - product.price).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(product)}
                className="w-full sm:w-auto bg-yellow-500 text-black font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-600 transition">
                Add to Cart
              </button>
              <Link to="/checkout" className="w-full sm:w-auto">
                <button className="w-full border border-yellow-500 text-yellow-500 font-semibold rounded px-6 py-3 text-sm md:text-base hover:bg-yellow-500 hover:text-black transition">
                  Buy Now
                </button>
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col gap-2">
              <p className="text-gray-400 text-xs md:text-sm">🚚 Free shipping on this item</p>
              <p className="text-gray-400 text-xs md:text-sm">✅ 2-Year warranty included</p>
              <p className="text-gray-400 text-xs md:text-sm">↩️ 30-day return policy</p>
            </div>

          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-white font-serif font-bold text-xl md:text-2xl lg:text-3xl mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {related.map((item) => (
                <Link
                  to={`/product/${item.id}`}
                  key={item.id}
                  className="bg-zinc-900 rounded-lg overflow-hidden group border-2 border-transparent hover:border-yellow-500 transition duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="p-2 md:p-3">
                    <h3 className="text-white text-xs md:text-sm font-semibold truncate mb-1">
                      {item.name}
                    </h3>
                    <span className="text-yellow-500 font-bold text-xs md:text-sm">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductDetail