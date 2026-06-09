const products = [
  // MENS WATCHES
  { id: 1, name: "Royal Chronograph", price: 4499, originalPrice: 5999, category: "mens", badge: "bestseller", image: "/images/watches/mens/mens-1.jpg", description: "A masterpiece of precision engineering with leather and silver accents." },
  { id: 2, name: "Classic Timemaster", price: 3299, originalPrice: 4500, category: "mens", badge: "", image: "/images/watches/mens/mens-2.jpg", description: "Timeless elegance for the modern gentleman." },
  { id: 3, name: "Black Phantom", price: 5999, originalPrice: 7000, category: "mens", badge: "sale", image: "/images/watches/mens/mens-3.jpg", description: "Bold and sophisticated with a stealth black finish." },
  { id: 4, name: "Silver Emperor", price: 8999, originalPrice: 10000, category: "mens", badge: "bestseller", image: "/images/watches/mens/mens-4.jpg", description: "Pure silver craftsmanship for the distinguished man." },
  { id: 5, name: "Silver Storm", price: 2799, originalPrice: 3500, category: "mens", badge: "", image: "/images/watches/mens/mens-5.jpg", description: "Sleek silver design with Swiss movement." },
  { id: 6, name: "Titan Pro", price: 3999, originalPrice: 4999, category: "mens", badge: "sale", image: "/images/watches/mens/mens-6.jpg", description: "Titanium built for strength and elegance." },
  { id: 7, name: "Black Phantom", price: 4299, originalPrice: 5500, category: "mens", badge: "", image: "/images/watches/mens/mens-7.jpg", description: "Deep black dial with luminous hands." },
  { id: 8, name: "Heritage Classic", price: 6499, originalPrice: 8000, category: "mens", badge: "bestseller", image: "/images/watches/mens/mens-8.jpg", description: "A tribute to classic watchmaking heritage." },
  { id: 9, name: "Carbon Elite", price: 5299, originalPrice: 6500, category: "mens", badge: "", image: "/images/watches/mens/mens-9.jpg", description: "Carbon fiber case with premium leather strap." },
  { id: 10, name: "Prestige Gold", price: 9999, originalPrice: 12000, category: "mens", badge: "sale", image: "/images/watches/mens/mens-10.jpg", description: "The pinnacle of mens luxury watchmaking." },

  // WOMENS WATCHES
  { id: 11, name: "Snow Elegance", price: 3499, originalPrice: 4500, category: "womens", badge: "bestseller", image: "/images/watches/womens/womens-1.jpg", description: "Snow case with diamond accents." },
  { id: 12, name: "Pearl Queen", price: 2999, originalPrice: 3800, category: "womens", badge: "", image: "/images/watches/womens/womens-2.jpg", description: "Elegant pearl dial with slim profile." },
  { id: 13, name: "Diamond Bliss", price: 7999, originalPrice: 9500, category: "womens", badge: "sale", image: "/images/watches/womens/womens-3.jpg", description: "Diamond studded bezel for ultimate luxury." },
  { id: 14, name: "Gold Butterfly", price: 4299, originalPrice: 5500, category: "womens", badge: "bestseller", image: "/images/watches/womens/womens-4.jpg", description: "Butterfly clasp with 18k gold plating." },
  { id: 15, name: "Sapphire Dream", price: 5499, originalPrice: 6800, category: "womens", badge: "", image: "/images/watches/womens/womens-5.jpg", description: "Deep sapphire  dial with silver case." },
  { id: 16, name: "Crystal Charm", price: 2499, originalPrice: 3200, category: "womens", badge: "", image: "/images/watches/womens/womens-6.jpg", description: "Crystal embellished case with silver strap." },
  { id: 17, name: "Black Rose", price: 3799, originalPrice: 4800, category: "womens", badge: "sale", image: "/images/watches/womens/womens-7.jpg", description: "Soft rose tone with velvet strap detail." },
  { id: 18, name: "Silver Goddess", price: 4999, originalPrice: 6200, category: "womens", badge: "", image: "/images/watches/womens/womens-8.jpg", description: "Sterling silver with goddess motif dial." },
  { id: 19, name: "Floral Grace", price: 3199, originalPrice: 4000, category: "womens", badge: "bestseller", image: "/images/watches/womens/womens-9.jpg", description: "Floral engraved case with pastel dial." },
  { id: 20, name: "Pink Diva", price: 6999, originalPrice: 8500, category: "womens", badge: "", image: "/images/watches/womens/womens-10.jpg", description: "Bold and luxurious for the modern woman." },

  // LUXURY WATCHES
  { id: 21, name: "Patek Grand", price: 29999, originalPrice: 35000, category: "luxury", badge: "bestseller", image: "/images/watches/luxury/luxury-1.jpg", description: "Inspired by Patek Philippe craftsmanship." },
  { id: 22, name: "Audemars Elite", price: 49999, originalPrice: 58000, category: "luxury", badge: "", image: "/images/watches/luxury/luxury-2.jpg", description: "Royal Oak inspired luxury timepiece." },
  { id: 23, name: "Vacheron Master", price: 39999, originalPrice: 46000, category: "luxury", badge: "sale", image: "/images/watches/luxury/luxury-3.jpg", description: "Swiss made luxury with tourbillon movement." },
  { id: 24, name: "Breguet Classic", price: 24999, originalPrice: 30000, category: "luxury", badge: "bestseller", image: "/images/watches/luxury/luxury-4.jpg", description: "Classic Breguet style with enamel dial." },
  { id: 25, name: "Jaeger Master", price: 18999, originalPrice: 22000, category: "luxury", badge: "", image: "/images/watches/luxury/luxury-5.jpg", description: "Master compressor design with moonphase." },
  { id: 26, name: "IWC Pilot", price: 14999, originalPrice: 18000, category: "luxury", badge: "sale", image: "/images/watches/luxury/luxury-6.jpg", description: "Pilot inspired luxury with ceramic bezel." },
  { id: 27, name: "Panerai Luminor", price: 12999, originalPrice: 15500, category: "luxury", badge: "", image: "/images/watches/luxury/luxury-7.jpg", description: "Bold Italian design with luminous dial." },
  { id: 28, name: "Cartier Santos", price: 8999, originalPrice: 11000, category: "luxury", badge: "bestseller", image: "/images/watches/luxury/luxury-8.jpg", description: "Iconic Santos design in rose gold." },
  { id: 29, name: "Hublot Big Bang", price: 16999, originalPrice: 20000, category: "luxury", badge: "", image: "/images/watches/luxury/luxury-9.jpg", description: "Big Bang fusion of materials and style." },
  { id: 30, name: "Richard Mille", price: 89999, originalPrice: 100000, category: "luxury", badge: "sale", image: "/images/watches/luxury/luxury-10.jpg", description: "Ultra premium skeletonized luxury watch." },

  // SMART WATCHES
  { id: 31, name: "Apex Pro", price: 799, originalPrice: 999, category: "smart", badge: "bestseller", image: "/images/watches/smart/smart-1.jpg", description: "Advanced health tracking with AMOLED display." },
  { id: 32, name: "FitMax Ultra", price: 599, originalPrice: 799, category: "smart", badge: "", image: "/images/watches/smart/smart-2.jpg", description: "Fitness focused smartwatch with GPS." },
  { id: 33, name: "TechWrist X", price: 899, originalPrice: 1099, category: "smart", badge: "sale", image: "/images/watches/smart/smart-3.jpg", description: "Premium smartwatch with ECG monitoring." },
  { id: 34, name: "SportPulse", price: 449, originalPrice: 599, category: "smart", badge: "bestseller", image: "/images/watches/smart/smart-4.jpg", description: "Sports focused with 50m water resistance." },
  { id: 35, name: "LuxTech Elite", price: 999, originalPrice: 1299, category: "smart", badge: "", image: "/images/watches/smart/smart-5.jpg", description: "Luxury smart watch with sapphire crystal." },
  { id: 36, name: "HealthGuard", price: 349, originalPrice: 499, category: "smart", badge: "", image: "/images/watches/smart/smart-6.jpg", description: "24/7 health monitoring smartwatch." },
  { id: 37, name: "ProRunner", price: 699, originalPrice: 899, category: "smart", badge: "sale", image: "/images/watches/smart/smart-7.jpg", description: "Built for serious runners with advanced metrics." },
  { id: 38, name: "SmartClassic", price: 549, originalPrice: 699, category: "smart", badge: "", image: "/images/watches/smart/smart-8.jpg", description: "Classic look with smart functionality." },
  { id: 39, name: "TurboSync", price: 799, originalPrice: 999, category: "smart", badge: "bestseller", image: "/images/watches/smart/smart-9.jpg", description: "Fast sync with all your devices." },
  { id: 40, name: "NexGen Watch", price: 1199, originalPrice: 1499, category: "smart", badge: "", image: "/images/watches/smart/smart-10.jpg", description: "Next generation smartwatch technology." },

  // KIDS WATCHES
  { id: 41, name: "Dino Buddy", price: 49, originalPrice: 79, category: "kids", badge: "bestseller", image: "/images/watches/kids/kids-1.jpg", description: "Fun dinosaur themed kids watch." },
  { id: 42, name: "Leather Flash", price: 39, originalPrice: 59, category: "kids", badge: "", image: "/images/watches/kids/kids-2.jpg", description: "Colorful leather design kids love." },
  { id: 43, name: "SpaceKid", price: 59, originalPrice: 89, category: "kids", badge: "sale", image: "/images/watches/kids/kids-3.jpg", description: "Space themed with glow in the dark hands." },
  { id: 44, name: "Pink Mickey", price: 45, originalPrice: 69, category: "kids", badge: "bestseller", image: "/images/watches/kids/kids-4.jpg", description: "Pretty  princess watch for girls." },
  { id: 45, name: "Hero Shield", price: 55, originalPrice: 79, category: "kids", badge: "", image: "/images/watches/kids/kids-5.jpg", description: "Superhero shield design for little heroes." },
  { id: 46, name: "Ocean Explorer", price: 49, originalPrice: 75, category: "kids", badge: "", image: "/images/watches/kids/kids-6.jpg", description: "Ocean themed waterproof kids watch." },
  { id: 47, name: "Jungle Roar", price: 44, originalPrice: 65, category: "kids", badge: "sale", image: "/images/watches/kids/kids-7.jpg", description: "Wild jungle animal themed watch." },
  { id: 48, name: "Star Chaser", price: 52, originalPrice: 75, category: "kids", badge: "", image: "/images/watches/kids/kids-8.jpg", description: "Starry night design with LED light." },
  { id: 49, name: "Robot Blaze", price: 58, originalPrice: 85, category: "kids", badge: "bestseller", image: "/images/watches/kids/kids-9.jpg", description: "Cool robot design kids will love." },
  { id: 50, name: "Magic Unicorn", price: 47, originalPrice: 70, category: "kids", badge: "", image: "/images/watches/kids/kids-10.jpg", description: "Magical unicorn design with pastel colors." },
]

export default products