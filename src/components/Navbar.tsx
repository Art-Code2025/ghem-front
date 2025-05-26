import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import { createCategorySlug } from '../utils/slugify';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('👤 User loaded from localStorage:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    } else {
      // For testing - auto login with demo user
      console.log('🔧 No user found, setting demo user for testing');
      const demoUser = {
        id: 5,
        name: 'ahmed maher',
        email: 'ahmedmaher123384@gmail.com',
        firstName: 'ahmed',
        lastName: 'maher'
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      console.log('✅ Demo user set:', demoUser);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, [user]);

  useEffect(() => {
    fetchCategories();
    
    // Enhanced cart and wishlist update handlers
    const handleCartUpdate = () => {
      console.log('🔄 Cart updated event received');
      setTimeout(() => fetchCart(), 100);
      setTimeout(() => fetchCart(), 500);
      setTimeout(() => fetchCart(), 1000);
    };
    
    const handleWishlistUpdate = () => {
      console.log('🔄 Wishlist updated event received');
      setTimeout(() => fetchWishlist(), 100);
      setTimeout(() => fetchWishlist(), 500);
      setTimeout(() => fetchWishlist(), 1000);
    };
    
    // Multiple event listeners for better coverage
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('productAddedToCart', handleCartUpdate);
    window.addEventListener('productAddedToWishlist', handleWishlistUpdate);
    
    // Storage events for cross-tab updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartUpdated') {
        console.log('🔄 Cart storage event received');
        setTimeout(() => fetchCart(), 100);
      }
      if (e.key === 'wishlistUpdated') {
        console.log('🔄 Wishlist storage event received');
        setTimeout(() => fetchWishlist(), 100);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Force refresh every 5 seconds for testing
    const interval = setInterval(() => {
      if (user && user.id) {
        console.log('🔄 Auto-refreshing cart and wishlist...');
        fetchCart();
        fetchWishlist();
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('productAddedToCart', handleCartUpdate);
      window.removeEventListener('productAddedToWishlist', handleWishlistUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [user]);

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');
      const response = await fetch('http://localhost:3001/api/categories');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Categories fetched:', data);
        setCategories(data);
      } else {
        console.error('❌ Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const fetchCart = async () => {
    try {
      if (!user || !user.id) {
        setCartItemsCount(0);
        return;
      }
      console.log('🛒 Fetching cart for user:', user.id);
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`);
      if (!response.ok) {
        setCartItemsCount(0);
        return;
      }
      const data = await response.json();
      const itemsCount = data.reduce((total: number, item: CartItem) => total + item.quantity, 0);
      console.log('✅ Cart items count:', itemsCount);
      setCartItemsCount(itemsCount);
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCartItemsCount(0);
    }
  };

  const fetchWishlist = async () => {
    try {
      if (!user || !user.id) {
        setWishlistItemsCount(0);
        return;
      }
      console.log('❤️ Fetching wishlist for user:', user.id);
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/wishlist`);
      if (!response.ok) {
        setWishlistItemsCount(0);
        return;
      }
      const data = await response.json();
      console.log('✅ Wishlist items count:', data.length);
      setWishlistItemsCount(data.length);
    } catch (error) {
      console.error('❌ Error fetching wishlist:', error);
      setWishlistItemsCount(0);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
    setTimeout(() => {
      fetchCart();
      fetchWishlist();
    }, 100);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsUserMenuOpen(false);
    setCartItemsCount(0);
    setWishlistItemsCount(0);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav dir="rtl" className={`fixed top-0 right-0 w-full z-50 transition-all duration-700 ease-out ${
        scrolled 
          ? 'bg-[#f8f6ea]/95 backdrop-blur-2xl shadow-2xl shadow-gray-300/20 border-b border-gray-300/30' 
          : 'bg-[#f8f6ea]/80 backdrop-blur-xl shadow-xl'
        }`}>
        
        {/* Premium Glass Morphism Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6ea]/20 via-[#f8f6ea]/30 to-[#f8f6ea]/20 backdrop-blur-3xl" />
        
        {/* Luxury Border Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent" />
        
        <div className="relative flex items-center justify-between h-24 px-6 lg:px-12">
          {/* Menu Button for Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 hover:text-gray-600 p-3 rounded-2xl lg:hidden transition-all duration-300 ease-out transform hover:scale-110 bg-white/40 backdrop-blur-xl border border-gray-300/40 shadow-lg hover:shadow-xl"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Premium Logo - Slightly Smaller */}
          <Link to="/" className="flex items-center gap-4 transition-all duration-500 hover:scale-105 group">
            <div className="relative">
              <img src={logo} alt="Premium Brand Logo" className="h-20 w-auto drop-shadow-2xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <button
                  key={category.id}
                  id={`category-btn-${category.id}`}
                  data-category-name={category.name}
                  data-category-id={category.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔗 Category clicked:', category.name, 'ID:', category.id);
                    console.log('🔗 Button element:', e.currentTarget);
                    console.log('🔗 Event details:', e);
                    
                    if (category.name === 'مريول مدرسي') {
                      console.log('🎯 مريول مدرسي clicked! Force navigating...');
                      console.log('🎯 Current location:', window.location.href);
                    }
                    
                    try {
                      const categorySlug = createCategorySlug(category.id, category.name);
                      navigate(`/category/${categorySlug}`);
                      console.log('✅ Navigation attempted to:', `/category/${categorySlug}`);
                    } catch (error) {
                      console.error('❌ Navigation error:', error);
                    }
                  }}
                  className={`relative px-6 py-3 rounded-2xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 ease-out transform hover:scale-105 group cursor-pointer z-10 ${
                    isActive(`/category/${createCategorySlug(category.id, category.name)}`) 
                      ? 'bg-white/60 backdrop-blur-xl border border-gray-300/50 text-gray-800 shadow-lg' 
                      : 'hover:bg-white/40 hover:backdrop-blur-xl hover:border hover:border-gray-300/30'
                  }`}
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    pointerEvents: 'auto'
                  }}
                >
                  {category.name}
                  
                  {/* Premium Hover Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f8f6ea]/20 via-[#f8f6ea]/30 to-[#f8f6ea]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Active Indicator */}
                  {isActive(`/category/${createCategorySlug(category.id, category.name)}`) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 rounded-full shadow-lg" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                {categories.length === 0 ? 'جاري تحميل التصنيفات...' : 'لا توجد تصنيفات'}
              </div>
            )}
          </div>

          {/* Premium Icons Section */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-3 text-gray-700 hover:text-gray-800 transition-all duration-300 ease-out transform hover:scale-110 bg-white/40 backdrop-blur-xl border border-gray-300/40 rounded-2xl shadow-lg hover:shadow-xl group">
              <ShoppingCart className="w-7 h-7" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                  {cartItemsCount}
                </span>
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f8f6ea]/20 to-[#f8f6ea]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative p-3 text-gray-700 hover:text-gray-800 transition-all duration-300 ease-out transform hover:scale-110 bg-white/40 backdrop-blur-xl border border-gray-300/40 rounded-2xl shadow-lg hover:shadow-xl group">
              <Heart className="w-7 h-7" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                  {wishlistItemsCount}
                </span>
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f8f6ea]/20 to-[#f8f6ea]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 text-gray-700 px-6 py-3 rounded-2xl bg-gradient-to-r from-white/60 to-[#f8f6ea]/60 backdrop-blur-xl border border-gray-300/40 hover:bg-gradient-to-r hover:from-white/80 hover:to-[#f8f6ea]/80 transition-all duration-300 ease-out transform hover:scale-105 shadow-xl hover:shadow-2xl group"
                >
                  <User size={24} className="text-pink-500" />
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">مرحبًا يا {user.name?.split(' ')[0] || user.firstName || 'عزيزي العميل'}</span>
                    <div className="text-xs text-gray-600 font-light">أهلاً بك في تجربتك الفاخرة</div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-[#f8f6ea]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-300/40 py-4 animate-[slideInFromTop_0.3s_ease-out]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f8f6ea]/30 via-[#f8f6ea]/40 to-[#f8f6ea]/30 rounded-3xl" />
                    <div className="relative">
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-6 py-4 text-sm text-gray-700 hover:text-gray-800 hover:bg-white/40 flex items-center gap-4 transition-all duration-300 ease-out group"
                      >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform duration-300 text-pink-500" />
                        <span className="font-medium">تسجيل خروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="relative bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-2xl backdrop-blur-xl border border-pink-400/30 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 ease-out transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold group"
              >
                <div className="flex items-center gap-2">
                  <User size={20} className="text-white" />
                  <span>تسجيل الدخول</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            )}
          </div>
        </div>

        {/* Premium Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-out ${isMenuOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="bg-[#f8f6ea]/95 backdrop-blur-2xl shadow-2xl border-t border-gray-300/30 p-6 animate-[slideInFromTop_0.3s_ease-out]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8f6ea]/30 via-[#f8f6ea]/40 to-[#f8f6ea]/30" />
            <div className="relative space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      console.log('📱 Mobile Category clicked:', category.name, 'ID:', category.id);
                      const categorySlug = createCategorySlug(category.id, category.name);
                      navigate(`/category/${categorySlug}`);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-right block px-6 py-4 text-gray-700 hover:text-gray-800 hover:bg-white/40 rounded-2xl transition-all duration-300 ease-out backdrop-blur-xl border border-transparent hover:border-gray-300/30 group cursor-pointer ${
                      isActive(`/category/${createCategorySlug(category.id, category.name)}`) ? 'bg-white/60 border-gray-300/50 text-gray-800' : ''
                    }`}
                  >
                    {category.name}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f8f6ea]/20 to-[#f8f6ea]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  جاري تحميل التصنيفات...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ambient Light Effects */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl opacity-50" />
      </nav>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default Navbar;