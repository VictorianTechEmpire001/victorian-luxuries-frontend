import { Link } from 'react-router-dom'
import heroImage from '../assets/images/watches/hero.jpg'

const HeroSection = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-screen">

      {/* Background Image */}
      <img
        src={heroImage}
        alt="Hero Watch"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center
        px-4
        md:px-10
        lg:px-16">

        <h2 className="
          text-gray-300
          text-sm
          md:text-base
          lg:text-lg
          font-light
          tracking-widest
          uppercase
          mb-2">
          Victorian Luxuries
        </h2>

        <h1 className="
          text-white
          text-3xl
          md:text-5xl
          lg:text-6xl
          font-bold
          font-serif
          leading-tight
          mb-2">
          Discover
          <span className="text-yellow-500"> Victorian</span>
          <br />
          Luxury
        </h1>

        <p className="
          text-gray-300
          text-xs
          md:text-sm
          lg:text-base
          mt-3
          max-w-xs
          md:max-w-sm
          lg:max-w-md
          leading-relaxed">
          Premium watches for those who value style, precision and timeless elegance.
        </p>

        <div className="flex items-center gap-4 mt-6 md:mt-8">
          <Link to="/collections/mens">
            <button className="
              bg-yellow-500 text-black font-semibold rounded
              px-4 py-2 text-sm
              md:px-5 md:py-2.5 md:text-base
              lg:px-6 lg:py-3 lg:text-lg
              hover:bg-yellow-600 transition">
              Shop Now
            </button>
          </Link>

          <Link to="/collections/luxury">
            <button className="
              border border-yellow-500 text-yellow-500 font-semibold rounded
              px-4 py-2 text-sm
              md:px-5 md:py-2.5 md:text-base
              lg:px-6 lg:py-3 lg:text-lg
              hover:bg-yellow-500 hover:text-black transition">
              View Collections
            </button>
          </Link>
        </div>

      </div>

    </div>
  )
}

export default HeroSection