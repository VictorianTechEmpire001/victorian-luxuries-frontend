import { FaShippingFast, FaHeadset, FaShieldAlt } from 'react-icons/fa'

const TrustBadges = () => {
  return (
    <div className="bg-zinc-900 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-row justify-between items-center gap-2 md:gap-6">

          {/* Badge 1 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <FaShippingFast className="text-yellow-500 text-2xl md:text-3xl lg:text-4xl" />
            <div>
              <p className="text-white font-semibold text-xs md:text-sm lg:text-base">Free Shipping</p>
              <p className="text-gray-400 text-xs md:text-sm hidden md:block">On all orders worldwide</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-gray-700"></div>

          {/* Badge 2 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <FaHeadset className="text-yellow-500 text-2xl md:text-3xl lg:text-4xl" />
            <div>
              <p className="text-white font-semibold text-xs md:text-sm lg:text-base">24/7 Support</p>
              <p className="text-gray-400 text-xs md:text-sm hidden md:block">Always here to help you</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-gray-700"></div>

          {/* Badge 3 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center md:text-left">
            <FaShieldAlt className="text-yellow-500 text-2xl md:text-3xl lg:text-4xl" />
            <div>
              <p className="text-white font-semibold text-xs md:text-sm lg:text-base">2-Year Warranty</p>
              <p className="text-gray-400 text-xs md:text-sm hidden md:block">On all our timepieces</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TrustBadges