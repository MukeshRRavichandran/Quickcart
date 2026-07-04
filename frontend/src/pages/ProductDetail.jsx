import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Star, Plus, Minus, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const prod = await productsAPI.getById(id);
        setProduct(prod);
        setActiveImage(prod.image);
        
        // Load related products
        const related = await productsAPI.getAll(prod.category);
        setRelatedProducts(related.filter(p => p._id !== prod._id).slice(0, 4));
        
        // Find existing cart quantity if any
        const cartItem = cartItems.find(item => item.product && item.product._id === prod._id);
        if (cartItem) {
          setQuantity(cartItem.quantity);
        } else {
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error fetching product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, cartItems]);

  const handleWishlistToggle = async () => {
    if (!product) return;
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      alert(err.message || 'Please log in first.');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      // If already in cart, update quantity, else add
      const cartItem = cartItems.find(item => item.product && item.product._id === product._id);
      if (cartItem) {
        await updateQuantity(product._id, quantity);
      } else {
        await addToCart(product._id, quantity);
      }
      alert('Updated shopping basket!');
    } catch (err) {
      alert(err.message || 'Please login to add items to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 w-1/4 bg-neutral-100 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-neutral-100 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-10 w-3/4 bg-neutral-100 rounded"></div>
            <div className="h-6 w-1/4 bg-neutral-100 rounded"></div>
            <div className="h-20 bg-neutral-100 rounded"></div>
            <div className="h-12 w-1/3 bg-neutral-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">Product Not Found</h2>
        <p className="text-sm text-neutral-500">The product you are trying to view does not exist.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  
  const wishlisted = isWishlisted(product._id);

  // Mock secondary thumbnails
  const thumbnails = [
    product.image,
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 fade-in">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
        <Link to="/" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-neutral-600 truncate">{product.name}</span>
      </nav>

      {/* Main product view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Image and Gallery */}
        <div className="space-y-4">
          <div className="w-full aspect-square bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center p-4">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          
          <div className="flex gap-3 justify-center">
            {thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(thumb)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 p-0.5 transition-all ${
                  activeImage === thumb ? 'border-primary' : 'border-neutral-100 hover:border-neutral-300'
                }`}
              >
                <img src={thumb} alt="" className="w-full h-full object-cover rounded-lg" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product details */}
        <div className="space-y-6 text-left">
          
          {/* Tag */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary-light text-primary font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              Certified Organic
            </span>
            {discountPercent > 0 && (
              <span className="bg-accent-light text-accent font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="font-outfit font-extrabold text-3xl sm:text-4xl text-neutral-800 leading-tight">
              {product.name}
            </h1>
            
            {/* Star ratings */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <div className="flex text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-neutral-800">{product.rating}</span>
              <span>({product.reviewsCount} Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 border-t border-b border-neutral-100 flex items-baseline gap-3">
            <span className="font-outfit font-extrabold text-3xl text-neutral-800">
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-neutral-400 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-neutral-400 font-semibold block capitalize ml-2">
              per {product.unit}
            </span>
          </div>

          {/* Quantity Selector and Add Button */}
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Selector */}
            <div className="flex items-center bg-neutral-100 rounded-xl p-1.5 border border-neutral-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 bg-white hover:bg-neutral-50 rounded-lg text-neutral-600 shadow-sm transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 font-outfit font-bold text-neutral-800 min-w-[32px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 bg-white hover:bg-neutral-50 rounded-lg text-neutral-600 shadow-sm transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Basket button */}
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="flex-grow sm:flex-grow-0 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2"
            >
              Add to Basket
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-xl border transition-colors ${
                wishlisted
                  ? 'bg-accent-light border-accent/20 text-accent'
                  : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 text-[10px] font-bold text-neutral-600">
            <div className="flex items-center gap-1.5 p-2 bg-neutral-100/60 border border-neutral-100 rounded-lg justify-center">
              <ShieldCheck size={14} className="text-primary" />
              <span>Non-GMO</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-neutral-100/60 border border-neutral-100 rounded-lg justify-center">
              <Sparkles size={14} className="text-primary" />
              <span>Local Farm</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-neutral-100/60 border border-neutral-100 rounded-lg justify-center">
              <HeartPulse size={14} className="text-primary" />
              <span>Heart Healthy</span>
            </div>
          </div>

        </div>
      </div>

      {/* Description & Nutrition facts block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-neutral-100">
        
        {/* Description */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-lg text-neutral-800 border-b border-neutral-50 pb-2">
            Product Description
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {product.description}
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-neutral-600 pt-4">
            <div className="p-3 bg-neutral-50 rounded-xl">
              <span className="text-primary block mb-1">Perfect Ripening</span>
              Ships firm; ripens at room temperature for 2-3 days until slightly soft to the touch.
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl">
              <span className="text-primary block mb-1">Sustainable Packing</span>
              Delivered in 100% recyclable, compostable pulp trays to ensure maximum freshness.
            </div>
          </div>
        </div>

        {/* Nutritional Facts */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Nutritional Facts
          </h3>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
            Per 100g serving (approx. half avocado)
          </span>

          <table className="w-full text-xs text-neutral-600">
            <tbody>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between">
                <td className="font-bold text-neutral-800">Calories</td>
                <td>{product.nutritionalFacts?.calories || '160 kcal'}</td>
              </tr>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between">
                <td className="font-bold text-neutral-800">Total Fat</td>
                <td>{product.nutritionalFacts?.totalFat || '15g (19%)'}</td>
              </tr>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between pl-3 text-neutral-500">
                <td>Saturated Fat</td>
                <td>{product.nutritionalFacts?.saturatedFat || '2.1g'}</td>
              </tr>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between">
                <td className="font-bold text-neutral-800">Total Carbohydrate</td>
                <td>{product.nutritionalFacts?.totalCarbohydrate || '9g (3%)'}</td>
              </tr>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between pl-3 text-neutral-500">
                <td>Dietary Fiber</td>
                <td>{product.nutritionalFacts?.dietaryFiber || '7g (25%)'}</td>
              </tr>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between">
                <td className="font-bold text-neutral-800">Protein</td>
                <td>{product.nutritionalFacts?.protein || '2g (4%)'}</td>
              </tr>
              <tr className="border-b border-neutral-50 py-1.5 flex justify-between">
                <td className="font-bold text-neutral-800">Potassium</td>
                <td>{product.nutritionalFacts?.potassium || '485mg (14%)'}</td>
              </tr>
              <tr className="py-1.5 flex justify-between">
                <td className="font-bold text-neutral-800">Vitamin K</td>
                <td className="font-bold text-primary">{product.nutritionalFacts?.vitaminK || '26% DV'}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* You Might Also Like */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-neutral-100">
          <div className="flex justify-between items-end pb-2">
            <div>
              <h2 className="font-outfit font-extrabold text-xl text-neutral-800">
                You Might Also Like
              </h2>
              <p className="text-xs text-neutral-400">Pair your select items with these fresh favorites</p>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-primary hover:text-primary-dark"
            >
              View All Produce &gt;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
