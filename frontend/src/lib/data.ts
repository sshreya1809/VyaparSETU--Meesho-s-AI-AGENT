/**
 * Meesho Front Page Prototype - Product & Category Data
 */

export const MEESHO_CATEGORIES = [
  {
    id: 'women-ethnic',
    name: 'Women Ethnic',
    subcategories: ['All Women Ethnic', 'Sarees', 'Kurtis', 'Kurta Sets', 'Suits & Dress Material', 'Lehengas']
  },
  {
    id: 'women-western',
    name: 'Women Western',
    subcategories: ['Tops', 'Dresses', 'Jeans & Jeggings', 'T-shirts', 'Skirts & Shorts']
  },
  {
    id: 'men',
    name: 'Men',
    subcategories: ['All Men', 'T-shirts', 'Casual Shirts', 'Formal Shirts', 'Jeans', 'Ethnic Wear']
  },
  {
    id: 'kids',
    name: 'Kids',
    subcategories: ['Toys & Games', 'Boys Clothing', 'Girls Clothing', 'Baby Care']
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    subcategories: ['Bed Sheets', 'Curtains', 'Kitchen Storage', 'Cookware', 'Home Decor']
  },
  {
    id: 'beauty-health',
    name: 'Beauty & Health',
    subcategories: ['Make Up', 'Skincare', 'Haircare', 'Oral Care', 'Wellness']
  },
  {
    id: 'jewellery-accessories',
    name: 'Jewellery & Accessories',
    subcategories: ['Jewellery Sets', 'Earrings', 'Mangalsutras', 'Watches', 'Sunglasses']
  },
  {
    id: 'bags-footwear',
    name: 'Bags & Footwear',
    subcategories: ['Women Bags', 'Men Bags', 'Women Footwear', 'Men Footwear']
  },
  {
    id: 'electronics',
    name: 'Electronics',
    subcategories: ['Mobile Accessories', 'Smartwatches', 'Audio & Headphones', 'Home Appliances']
  }
];

export const MEESHO_FEATURED_CATEGORIES = [
  {
    id: 'women-ethnic',
    title: 'Saree & Kurtis',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    tag: 'Starting ₹149'
  },
  {
    id: 'women-western',
    title: 'Western Wear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    tag: 'Starting ₹199'
  },
  {
    id: 'men',
    title: 'Mens Fashion',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    tag: 'Starting ₹179'
  },
  {
    id: 'jewellery-accessories',
    title: 'Jewellery Sets',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    tag: 'Starting ₹99'
  },
  {
    id: 'home-kitchen',
    title: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    tag: 'Starting ₹129'
  },
  {
    id: 'electronics',
    title: 'Smart Gadgets',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
    tag: 'Starting ₹199'
  }
];

export const MEESHO_PRODUCTS = [
  {
    id: 'm101',
    title: 'Banarasi Kanjivaram Silk Woven Saree With Blouse Piece',
    category: 'women-ethnic',
    subCategory: 'Sarees',
    price: 342,
    originalPrice: 1199,
    discount: 71,
    rating: 4.1,
    reviews: 1420,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Best Seller',
    supplier: 'Lakshmi Fabrics Surat',
    description: 'Rich Pallu Banarasi Silk Saree with zari weaving work and matching contrast blouse piece. Soft fabric suitable for weddings and festive wear.'
  },
  {
    id: 'm102',
    title: 'Women Rayon Embroidered Anarkali Kurta With Dupatta',
    category: 'women-ethnic',
    subCategory: 'Kurtis',
    price: 418,
    originalPrice: 1499,
    discount: 72,
    rating: 4.3,
    reviews: 3215,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Trending',
    supplier: 'Radhika Creation',
    description: 'Premium quality Rayon printed Anarkali Kurti set with heavy embroidery on yoke and matching printed dupatta.'
  },
  {
    id: 'm103',
    title: 'Men Regular Fit Cotton Blend Solid Casual Shirt',
    category: 'men',
    subCategory: 'Casual Shirts',
    price: 249,
    originalPrice: 799,
    discount: 69,
    rating: 4.0,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Lowest Price',
    supplier: 'Urban Men Wardrobe',
    description: 'Classic full sleeve cotton blend shirt with spread collar and curved hemline. Perfect for daily office and casual wear.'
  },
  {
    id: 'm104',
    title: 'Wireless Bluetooth Headphones With Deep Bass & Mic',
    category: 'electronics',
    subCategory: 'Audio & Headphones',
    price: 389,
    originalPrice: 1299,
    discount: 70,
    rating: 4.2,
    reviews: 5410,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Popular',
    supplier: 'DigiTech Direct',
    description: 'Ergonomic over-ear wireless headphones with up to 20 hours battery backup, Hi-Fi stereo sound, and built-in noise cancellation mic.'
  },
  {
    id: 'm105',
    title: 'Elegant Gold Plated Kundan & Pearl Choker Necklace Set',
    category: 'jewellery-accessories',
    subCategory: 'Jewellery Sets',
    price: 185,
    originalPrice: 999,
    discount: 81,
    rating: 4.4,
    reviews: 4120,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Best Seller',
    supplier: 'Royal Heritage Jewels',
    description: 'Traditional Kundan studded choker necklace set with matching drop earrings and maang tikka.'
  },
  {
    id: 'm106',
    title: '3-Piece Non-Stick Granite Cookware Set With Glass Lid',
    category: 'home-kitchen',
    subCategory: 'Cookware',
    price: 649,
    originalPrice: 1999,
    discount: 68,
    rating: 4.3,
    reviews: 1820,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Meesho Choice',
    supplier: 'Kitchen Craft India',
    description: 'Durable 5-layer non-stick granite coating induction and gas compatible kadai, fry pan, and tawa set.'
  },
  {
    id: 'm107',
    title: 'Women Stylish Floral Print Puff Sleeve Midi Dress',
    category: 'women-western',
    subCategory: 'Dresses',
    price: 319,
    originalPrice: 999,
    discount: 68,
    rating: 4.1,
    reviews: 740,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'New Arrival',
    supplier: 'Western Vogue',
    description: 'Trendy square neck floral print midi dress crafted in breathable crepe fabric with comfortable elasticated waist.'
  },
  {
    id: 'm108',
    title: 'Men Stylish Lightweight Running & Walking Sports Shoes',
    category: 'bags-footwear',
    subCategory: 'Men Footwear',
    price: 399,
    originalPrice: 1299,
    discount: 69,
    rating: 4.0,
    reviews: 2190,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Lowest Price',
    supplier: 'Stride Footwear',
    description: 'Breathable mesh upper sports shoes with EVA cushioned sole for everyday fitness and casual comfort.'
  },
  {
    id: 'm109',
    title: 'Smart Fitness Watch 1.83" HD Display & Bluetooth Calling',
    category: 'electronics',
    subCategory: 'Smartwatches',
    price: 899,
    originalPrice: 2999,
    discount: 70,
    rating: 4.3,
    reviews: 6730,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Top Rated',
    supplier: 'Nova Electronics',
    description: 'Sleek smart fitness watch with 100+ sports modes, SpO2 & heart rate monitoring, AI voice assistant, and IP68 waterproof design.'
  },
  {
    id: 'm110',
    title: 'Luxury Pure Cotton 200 TC Double Bed Sheet With 2 Pillow Covers',
    category: 'home-kitchen',
    subCategory: 'Bed Sheets',
    price: 349,
    originalPrice: 1199,
    discount: 71,
    rating: 4.2,
    reviews: 3890,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Best Seller',
    supplier: 'Panipat Weavers',
    description: 'Color-fast Rajasthani block print pure cotton double bed sheet designed for long-lasting softness and elegance.'
  },
  {
    id: 'm111',
    title: 'Women Ethnic Embellished Potli Bag & Handbag',
    category: 'bags-footwear',
    subCategory: 'Women Bags',
    price: 199,
    originalPrice: 699,
    discount: 72,
    rating: 4.4,
    reviews: 1340,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Trending',
    supplier: 'Jaipur Handcrafts',
    description: 'Exquisite pearl and zari hand embroidery potli bag with beaded drawstring closure.'
  },
  {
    id: 'm112',
    title: 'Natural Vitamin C Facial Serum For Bright & Glowing Skin',
    category: 'beauty-health',
    subCategory: 'Skincare',
    price: 169,
    originalPrice: 499,
    discount: 66,
    rating: 4.2,
    reviews: 4510,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    freeDelivery: true,
    badge: 'Meesho Choice',
    supplier: 'DermaGlow India',
    description: 'Lightweight hyaluronic acid and Vitamin C face serum that hydrates and revitalizes skin texture.'
  }
];
