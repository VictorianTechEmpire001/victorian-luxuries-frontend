import { Link } from 'react-router-dom'
import { GiPocketWatch } from 'react-icons/gi'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
      <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GiPocketWatch className="text-yellow-500 text-2xl md:text-3xl" />
              <span className="text-white font-serif text-base md:text-lg">Victorian</span>
              <span className="text-yellow-500 font-serif font-bold text-base md:text-lg">LUXURIES</span>
            </Link>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Premium timepieces for those who value style, precision and timeless elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-500 font-semibold text-base md:text-lg mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to="/" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Home</Link></li>
              <li><Link to="/bestsellers" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Bestsellers</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Contact</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Cart</Link></li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-yellow-500 font-semibold text-base md:text-lg mb-4">Collections</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to="/collections/mens" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Men's Watches</Link></li>
              <li><Link to="/collections/womens" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Women's Watches</Link></li>
              <li><Link to="/collections/luxury" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Luxury Watches</Link></li>
              <li><Link to="/collections/smart" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Smartwatches</Link></li>
              <li><Link to="/collections/kids" className="text-gray-400 hover:text-yellow-500 transition text-sm md:text-base">Kids Watches</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-yellow-500 font-semibold text-base md:text-lg mb-4">Contact Us</h3>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm md:text-base">
              <li className="break-all">📧 iwejuovictorchigoziri9@gmail.com</li>
              <li>📞 +2349036371746</li>
              <li>📍 Lagos, Nigeria</li>
              <li>🕐 Mon - Sat: 9am - 6pm</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
              © 2026 Victorian Luxuries. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition text-lg md:text-xl"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition text-lg md:text-xl"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition text-lg md:text-xl"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition text-lg md:text-xl"><FaYoutube /></a>
            </div>

          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer