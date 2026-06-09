import { Link } from 'react-router-dom'
import products from '../Data/products'

const Bestsellers = () => {
  const bestsellers = products
    .filter(p => p.badge === "bestseller")
    .slice(4, 8)

  return (
    <div className="bg-black pt-10 pb-6 md:pt-14 md:pb-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-white font-serif font-bold text-center text-2xl md:text-3xl lg:text-4xl mb-2">
          Shop Bestsellers
        </h1>
        <p className="text-gray-400 text-center text-sm md:text-base mb-8 md:mb-12">
          Our most loved luxury timepieces
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {bestsellers.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-zinc-900 rounded-lg overflow-hidden group border-2 border-transparent hover:border-yellow-500 transition duration-300">

              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-36 md:h-44 lg:h-52 object-cover group-hover:scale-105 transition duration-300"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-2 md:p-3 lg:p-4">
                <h3 className="text-white font-semibold text-xs md:text-sm lg:text-base mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-xs mb-2 hidden md:block line-clamp-2">
                  {product.description}
                </p>
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

        {/* Back to Home */}
        <div className="flex justify-center mt-8 mb-4">
          <Link to="/">
            <button className="border border-yellow-500 text-yellow-500 font-semibold rounded px-6 py-2.5 text-sm md:px-8 md:py-3 md:text-base hover:bg-yellow-500 hover:text-black transition">
              ← Back to Home
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Bestsellers