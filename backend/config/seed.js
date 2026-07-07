import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/product.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import Coupon from '../models/coupon.js';
import Cart from '../models/cart.js';
import Wishlist from '../models/wishlist.js';
import Order from '../models/order.js';
import Notification from '../models/notification.js';
import Review from '../models/review.js';

dotenv.config();

const categories = [
  { name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Rice, Atta & Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Spices, Oils & Cooking Essentials', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Snacks & Biscuits', image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Beverages', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Meat, Fish & Seafood', image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=150&auto=format&fit=crop&q=80', status: 'Active' },
  { name: 'Sweets, Chocolates & Desserts', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=150&auto=format&fit=crop&q=80', status: 'Active' }
];

const coupons = [
  { code: 'FRESH20', name: 'Grand Reopening Special', type: 'Percentage', value: 20, minOrderValue: 25, status: 'Active', userLimit: 5 },
  { code: 'QUICK50', name: 'Super Flat Discount', type: 'Flat', value: 50, minOrderValue: 150, status: 'Active', userLimit: 2 },
  { code: 'ORGANIC20', name: 'Farming Special Campaign', type: 'Percentage', value: 20, minOrderValue: 30, status: 'Active', userLimit: 3 }
];

// Product array definition skipped for readability, keeping same products array intact...


const products = [
  {
    name: 'Organic Avocados',
    description: 'Sourced from Green Valley Farms, these organic avocados are creamy and rich, perfect for guacamole, salads, or spreading on toast.',
    price: 4.80,
    originalPrice: 6.00,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 154,
    unit: 'dozen',
    tags: ['Organic', 'Fresh Pick', 'Bestseller', 'Heart Healthy', 'Non-GMO'],
    nutritionalFacts: {
      calories: '160 kcal',
      totalFat: '15g (19%)',
      saturatedFat: '2.1g',
      totalCarbohydrate: '9g (3%)',
      dietaryFiber: '7g (25%)',
      protein: '2g (4%)',
      potassium: '485mg (14%)',
      vitaminK: '26% DV'
    }
  },
  {
    name: 'Fresh Strawberries',
    description: 'Local California strawberries, picked sweet and juicy at the peak of ripeness. A perfect addition to yogurt, cereal, or enjoyed on their own.',
    price: 3.40,
    originalPrice: 5.00,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 82,
    unit: '1 lb container',
    tags: ['Fresh Pick', 'Bestseller', 'Local Farm'],
    nutritionalFacts: {
      calories: '32 kcal',
      totalFat: '0.3g (0%)',
      saturatedFat: '0g',
      totalCarbohydrate: '7.7g (3%)',
      dietaryFiber: '2g (7%)',
      protein: '0.7g (1%)',
      potassium: '153mg (4%)',
      vitaminK: '2.2% DV'
    }
  },
  {
    name: 'Tri-Color Bell Peppers',
    description: 'A vibrant pack of three fresh bell peppers (Red, Yellow, and Orange). Sweet, crisp, and high in vitamin C. Ideal for stir-fries, fajitas, or dipping.',
    price: 4.00,
    originalPrice: 5.50,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1563565080-89fb389e7877?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 64,
    unit: '3 Pack',
    tags: ['Bestseller', 'Fresh Pick'],
    nutritionalFacts: {
      calories: '24 kcal',
      totalFat: '0.2g (0%)',
      saturatedFat: '0g',
      totalCarbohydrate: '6g (2%)',
      dietaryFiber: '2g (8%)',
      protein: '1g (2%)',
      potassium: '211mg (6%)',
      vitaminK: '4% DV'
    }
  },
  {
    name: 'Organic Curly Kale',
    description: 'Crisp green curly kale leaves, packed with antioxidants, calcium, and vitamins. Excellent for raw salads, green smoothies, or baking into kale chips.',
    price: 2.50,
    originalPrice: 3.50,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1628773822503-930a8589787e?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 45,
    unit: '1 Bunch',
    tags: ['Organic', 'Heart Healthy', 'Local Farm'],
    nutritionalFacts: {
      calories: '33 kcal',
      totalFat: '0.6g (1%)',
      saturatedFat: '0.1g',
      totalCarbohydrate: '6g (2%)',
      dietaryFiber: '2.6g (10%)',
      protein: '2.9g (6%)',
      potassium: '348mg (10%)',
      vitaminK: '684% DV'
    }
  },
  {
    name: 'Pasture-Raised Eggs',
    description: 'Rich, golden yolks from hens raised on open pastures with daily organic forage. Sourced from local farm partners committed to humane standards.',
    price: 6.25,
    originalPrice: 7.50,
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 120,
    unit: 'dozen',
    tags: ['Organic', 'Farm Direct', 'Bestseller'],
    nutritionalFacts: {
      calories: '70 kcal',
      totalFat: '5g (6%)',
      saturatedFat: '1.6g',
      totalCarbohydrate: '0.6g (0%)',
      dietaryFiber: '0g',
      protein: '6g (12%)',
      potassium: '69mg (1%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Cold-Pressed Almond Milk',
    description: 'Small-batch almond milk pressed with a hint of Himalayan salt. No added sugar, gums, or artificial preservatives. Silky smooth and dairy-free.',
    price: 5.90,
    originalPrice: 6.90,
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 85,
    unit: '1L Bottle',
    tags: ['Vegan', 'Plant-Based', 'Non-GMO'],
    nutritionalFacts: {
      calories: '30 kcal',
      totalFat: '2.5g (3%)',
      saturatedFat: '0g',
      totalCarbohydrate: '1g (0%)',
      dietaryFiber: '1g (3%)',
      protein: '1g (2%)',
      potassium: '160mg (4%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Artisan Aged Cheddar',
    description: '12-month aged organic cheddar with a sharp, complex profile and smooth finish. Perfect for cheese boards, sandwiches, or snacking.',
    price: 8.50,
    originalPrice: 10.50,
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=600&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 92,
    unit: '250g Block',
    tags: ['Organic', 'Bestseller'],
    nutritionalFacts: {
      calories: '110 kcal',
      totalFat: '9g (12%)',
      saturatedFat: '5g',
      totalCarbohydrate: '1g (0%)',
      dietaryFiber: '0g',
      protein: '7g (14%)',
      potassium: '28mg (0%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Artisan Feta',
    description: 'Tangy, crumbly feta cheese crafted traditionally from pasture-fed sheep\'s milk. Brine-aged for full depth of flavor. Ideal for Greek salads.',
    price: 5.99,
    originalPrice: 7.49,
    category: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 51,
    unit: '200g',
    tags: ['Bestseller'],
    nutritionalFacts: {
      calories: '75 kcal',
      totalFat: '6g (8%)',
      saturatedFat: '4g',
      totalCarbohydrate: '1g (0%)',
      dietaryFiber: '0g',
      protein: '4g (8%)',
      potassium: '18mg (0%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Premium Basmati Rice',
    description: 'Aromatic long-grain aged Basmati rice. Sourced from Himalayan foothills, perfect for biryanis, pilafs, and daily meals.',
    price: 5.99,
    originalPrice: 7.49,
    category: 'Rice, Atta & Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 76,
    unit: '2 lb bag',
    tags: ['Bestseller', 'Organic'],
    nutritionalFacts: {
      calories: '350 kcal',
      totalFat: '0.6g (1%)',
      saturatedFat: '0.1g',
      totalCarbohydrate: '78g (26%)',
      dietaryFiber: '1.5g (6%)',
      protein: '7g (14%)',
      potassium: '115mg (3%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Whole Wheat Chakki Atta',
    description: '100% stone-ground whole wheat flour. Makes soft, delicious rotis and chapatis with natural fiber intact.',
    price: 4.50,
    originalPrice: 5.50,
    category: 'Rice, Atta & Grains',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 88,
    unit: '5 lb bag',
    tags: ['Organic', 'Local Farm'],
    nutritionalFacts: {
      calories: '340 kcal',
      totalFat: '2g (3%)',
      saturatedFat: '0.4g',
      totalCarbohydrate: '72g (24%)',
      dietaryFiber: '11g (44%)',
      protein: '13g (26%)',
      potassium: '340mg (10%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil from premium Spanish olives. Exceptional flavor for dressings, marinades, and light cooking.',
    price: 12.50,
    originalPrice: 15.00,
    category: 'Spices, Oils & Cooking Essentials',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 110,
    unit: '500 ml',
    tags: ['Bestseller', 'Heart Healthy'],
    nutritionalFacts: {
      calories: '120 kcal',
      totalFat: '14g (18%)',
      saturatedFat: '2g',
      totalCarbohydrate: '0g',
      dietaryFiber: '0g',
      protein: '0g',
      potassium: '0mg',
      vitaminK: '8% DV'
    }
  },
  {
    name: 'Organic Turmeric Powder',
    description: 'Pure, organic ground turmeric with high curcumin content. Adds a warm, earthy flavor and vivid color to curries and milk.',
    price: 3.20,
    originalPrice: 4.00,
    category: 'Spices, Oils & Cooking Essentials',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 42,
    unit: '100g',
    tags: ['Organic', 'Farm Direct'],
    nutritionalFacts: {
      calories: '24 kcal',
      totalFat: '0.7g (1%)',
      saturatedFat: '0.2g',
      totalCarbohydrate: '4.4g (1%)',
      dietaryFiber: '1.4g (6%)',
      protein: '0.5g (1%)',
      potassium: '170mg (5%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Crusty Sourdough Bread',
    description: 'Slow-fermented sourdough bread with a wild yeast starter. Thick, crispy crust and soft, airy interior.',
    price: 4.50,
    originalPrice: 5.50,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 110,
    unit: '1 loaf',
    tags: ['Fresh Pick', 'Local Farm'],
    nutritionalFacts: {
      calories: '185 kcal',
      totalFat: '1g (1%)',
      saturatedFat: '0g',
      totalCarbohydrate: '36g (12%)',
      dietaryFiber: '2g (8%)',
      protein: '7g (14%)',
      potassium: '90mg (2%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Fresh Butter Croissants',
    description: 'Flaky, buttery, golden French croissants baked fresh every morning with real butter.',
    price: 3.80,
    originalPrice: 4.50,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 65,
    unit: '4 Pack',
    tags: ['Fresh Pick'],
    nutritionalFacts: {
      calories: '231 kcal',
      totalFat: '12g (15%)',
      saturatedFat: '7g',
      totalCarbohydrate: '26g (9%)',
      dietaryFiber: '1.2g (5%)',
      protein: '5g (10%)',
      potassium: '72mg (2%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Organic Sweet Potato Chips',
    description: 'Thinly sliced sweet potatoes cooked in organic coconut oil and dusted with fine sea salt.',
    price: 3.99,
    originalPrice: 4.99,
    category: 'Snacks & Biscuits',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 42,
    unit: '8 oz bag',
    tags: ['Organic', 'Vegan'],
    nutritionalFacts: {
      calories: '140 kcal',
      totalFat: '7g (9%)',
      saturatedFat: '1.5g',
      totalCarbohydrate: '18g (6%)',
      dietaryFiber: '3g (11%)',
      protein: '2g (4%)',
      potassium: '340mg (10%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Roasted Salted Almonds',
    description: 'Premium almonds roasted to perfection and lightly salted. Great for snacks.',
    price: 6.50,
    originalPrice: 7.50,
    category: 'Snacks & Biscuits',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 89,
    unit: '12 oz bag',
    tags: ['Heart Healthy', 'Bestseller'],
    nutritionalFacts: {
      calories: '170 kcal',
      totalFat: '15g (19%)',
      saturatedFat: '1g',
      totalCarbohydrate: '6g (2%)',
      dietaryFiber: '3g (11%)',
      protein: '6g (12%)',
      potassium: '200mg (6%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Lemon Ginger Kombucha',
    description: 'Probiotic-rich fermented black tea flavored with cold-pressed organic lemons and zesty ginger.',
    price: 3.75,
    originalPrice: 4.50,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1594950192534-11881cf434e3?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 97,
    unit: '12 oz bottle',
    tags: ['Organic', 'Vegan', 'Bestseller'],
    nutritionalFacts: {
      calories: '35 kcal',
      totalFat: '0g (0%)',
      saturatedFat: '0g',
      totalCarbohydrate: '7g (2%)',
      dietaryFiber: '0g',
      protein: '0g',
      potassium: '45mg (1%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Cold-Brew Organic Coffee',
    description: '18-hour cold-steeped organic coffee beans. Smooth, low-acid, and naturally sweet.',
    price: 4.99,
    originalPrice: 5.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 114,
    unit: '16 oz bottle',
    tags: ['Organic', 'Vegan'],
    nutritionalFacts: {
      calories: '5 kcal',
      totalFat: '0g (0%)',
      saturatedFat: '0g',
      totalCarbohydrate: '0g',
      dietaryFiber: '0g',
      protein: '0g',
      potassium: '120mg (3%)',
      vitaminK: '0% DV'
    }
  },

  {
    name: 'Fresh Atlantic Salmon Fillet',
    description: 'Premium, wild-caught skin-on salmon fillet. Extremely rich in Omega-3 fatty acids. Ideal for grilling or pan-searing.',
    price: 14.99,
    originalPrice: 18.00,
    category: 'Meat, Fish & Seafood',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 94,
    unit: '1 lb Fillet',
    tags: ['Bestseller', 'Farm Direct'],
    nutritionalFacts: {
      calories: '206 kcal',
      totalFat: '12g (15%)',
      saturatedFat: '2.5g',
      totalCarbohydrate: '0g',
      dietaryFiber: '0g',
      protein: '22g (44%)',
      potassium: '360mg (10%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Organic Chicken Breast',
    description: 'Boneless, skinless organic chicken breasts from free-roaming chickens fed an organic diet. Lean and high in protein.',
    price: 8.99,
    originalPrice: 11.00,
    category: 'Meat, Fish & Seafood',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 71,
    unit: '1 lb',
    tags: ['Organic', 'Farm Direct'],
    nutritionalFacts: {
      calories: '120 kcal',
      totalFat: '1.5g (2%)',
      saturatedFat: '0.4g',
      totalCarbohydrate: '0g',
      dietaryFiber: '0g',
      protein: '26g (52%)',
      potassium: '220mg (6%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Dark Chocolate Truffles',
    description: 'Decadent 72% dark chocolate truffles, dusted with rich organic cocoa powder. Melt-in-your-mouth texture.',
    price: 6.99,
    originalPrice: 8.50,
    category: 'Sweets, Chocolates & Desserts',
    image: 'https://images.unsplash.com/photo-1548907040-4d42b52115ca?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 88,
    unit: '6 pack',
    tags: ['Bestseller', 'Seasonal Pick'],
    nutritionalFacts: {
      calories: '180 kcal',
      totalFat: '13g (17%)',
      saturatedFat: '8g',
      totalCarbohydrate: '15g (5%)',
      dietaryFiber: '2g (8%)',
      protein: '2g (4%)',
      potassium: '110mg (3%)',
      vitaminK: '0% DV'
    }
  },
  {
    name: 'Organic Strawberry Ice Cream',
    description: 'Creamy, small-batch ice cream made with real organic heavy cream and fresh California strawberries.',
    price: 4.50,
    originalPrice: 5.50,
    category: 'Sweets, Chocolates & Desserts',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 63,
    unit: '1 pint',
    tags: ['Organic', 'Local Farm'],
    nutritionalFacts: {
      calories: '210 kcal',
      totalFat: '12g (15%)',
      saturatedFat: '7g',
      totalCarbohydrate: '22g (7%)',
      dietaryFiber: '0.8g (3%)',
      protein: '3g (6%)',
      potassium: '140mg (4%)',
      vitaminK: '0% DV'
    }
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quickcart');
    console.log(`Connected to database for seeding: ${conn.connection.host}`);
    
    // Clear collections
    await Product.deleteMany({});
    await User.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Order.deleteMany({});
    await Notification.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared all collections.');

    // Seed Categories
    await Category.insertMany(categories);
    console.log('Seeded categories.');

    // Seed Coupons
    await Coupon.insertMany(coupons);
    console.log('Seeded coupons.');

    // Seed Users
    // 1. Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@quickcart.com',
      password: 'admin123',
      role: 'admin',
      isApproved: true
    });
    console.log('Seeded Admin: admin@quickcart.com');

    // 2. Customer
    const customer = await User.create({
      name: 'Jane Customer',
      email: 'customer@quickcart.com',
      password: 'customer123',
      role: 'customer',
      isApproved: true,
      phone: '+1 (555) 123-4567',
      address: {
        name: 'Jane Customer',
        address: '482 Fresh Garden Way, Suite 102',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        phone: '+1 (555) 123-4567'
      }
    });
    console.log('Seeded Customer: customer@quickcart.com');

    // 3. Seller
    const seller = await User.create({
      name: 'VeggieMart Seller',
      email: 'seller@quickcart.com',
      password: 'seller123',
      role: 'seller',
      storeName: 'VeggieMart',
      isApproved: true,
      phone: '+1 (555) 321-7654',
      description: 'Fresh organic greens and vegetables directly sourced from local fields to your kitchen.',
      gstin: '22AAAAA0000A1Z5',
      bankName: 'Organic Valley Bank',
      bankAccount: '•••• •••• 8743',
      routingNumber: '121000248',
      hours: '08:00 AM - 08:00 PM',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      address: {
        name: 'VeggieMart Pickup',
        address: '42 Greenway Ave',
        city: 'Fresh Meadows',
        state: 'CA',
        zipCode: '94016',
        phone: '+1 (555) 321-7654'
      }
    });
    console.log('Seeded Seller: seller@quickcart.com');

    // Seed Carts and Wishlists
    await Cart.create({ user: customer._id, items: [] });
    await Wishlist.create({ user: customer._id, products: [] });
    await Cart.create({ user: seller._id, items: [] });
    await Wishlist.create({ user: seller._id, products: [] });

    // Seed Products linked to the default seller
    const productsWithApproval = products.map((p, index) => ({
      ...p,
      seller: seller._id,
      stock: 15 + (index * 23) % 85,
      approvalStatus: 'approved'
    }));
    const createdProducts = await Product.insertMany(productsWithApproval);
    console.log(`Successfully seeded ${createdProducts.length} products linked to VeggieMart!`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
