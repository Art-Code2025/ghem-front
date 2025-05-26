import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, Eye } from 'lucide-react';
import { createProductSlug } from '../utils/slugify';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId?: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
    // eslint-disable-next-line
  }, [product.id]);

  const checkWishlistStatus = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setIsInWishlist(false);
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        setIsInWishlist(false);
        return;
      }
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/wishlist/check/${product.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsInWishlist(data.isInWishlist);
      }
    } catch {
      setIsInWishlist(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // منع فتح صفحة المنتج
    e.stopPropagation(); // منع انتشار الحدث
    
    setWishlistLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً لإضافة المنتجات إلى قائمة الرغبات');
        setWishlistLoading(false);
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً لإضافة المنتجات إلى قائمة الرغبات');
        setWishlistLoading(false);
        return;
      }
      if (isInWishlist) {
        const response = await fetch(`http://localhost:3001/api/user/${user.id}/wishlist/product/${product.id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setIsInWishlist(false);
          toast.success(`تم حذف ${product.name} من قائمة الرغبات! 💔`);
          
          // إرسال أحداث متعددة لضمان تحديث الـ navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
          window.dispatchEvent(new CustomEvent('productRemovedFromWishlist', {
            detail: { productId: product.id, productName: product.name }
          }));
          
          // Storage events
          localStorage.setItem('wishlistUpdated', Date.now().toString());
          localStorage.setItem('lastWishlistUpdate', new Date().toISOString());
          
          // Force window reload event
          window.dispatchEvent(new Event('storage'));
          
          // Manual navbar refresh attempts
          setTimeout(() => {
            window.dispatchEvent(new Event('wishlistUpdated'));
          }, 100);
          
          setTimeout(() => {
            window.dispatchEvent(new Event('wishlistUpdated'));
          }, 500);
        } else {
          const error = await response.json();
          toast.error(error.message || 'حدث خطأ في حذف المنتج من قائمة الرغبات');
        }
      } else {
        const response = await fetch(`http://localhost:3001/api/user/${user.id}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
        if (response.ok) {
          setIsInWishlist(true);
          toast.success(`تم إضافة ${product.name} إلى قائمة الرغبات! ❤️`);
          
          // إرسال أحداث متعددة لضمان تحديث الـ navbar
          window.dispatchEvent(new Event('wishlistUpdated'));
          window.dispatchEvent(new CustomEvent('productAddedToWishlist', {
            detail: { productId: product.id, productName: product.name }
          }));
          
          // Storage events
          localStorage.setItem('wishlistUpdated', Date.now().toString());
          localStorage.setItem('lastWishlistUpdate', new Date().toISOString());
          
          // Force window reload event
          window.dispatchEvent(new Event('storage'));
          
          // Manual navbar refresh attempts
          setTimeout(() => {
            window.dispatchEvent(new Event('wishlistUpdated'));
          }, 100);
          
          setTimeout(() => {
            window.dispatchEvent(new Event('wishlistUpdated'));
          }, 500);
          
          setTimeout(() => {
            window.dispatchEvent(new Event('wishlistUpdated'));
          }, 1000);
        } else {
          const error = await response.json();
          toast.error(error.message || 'حدث خطأ في إضافة المنتج إلى قائمة الرغبات');
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
    } finally {
      setWishlistLoading(false);
    }
  };

  const isOutOfStock = product.stock <= 0;

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // منع فتح صفحة المنتج
    e.stopPropagation(); // منع انتشار الحدث
    
    setAddToCartLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة');
        setAddToCartLoading(false);
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة');
        setAddToCartLoading(false);
        return;
      }
      
      const requestBody = {
        productId: product.id,
        quantity,
        selectedOptions: {},
        attachments: {
          images: [],
          text: ''
        }
      };
      
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(`تم إضافة ${product.name} إلى السلة بنجاح! 🛒`);
        
        // إرسال أحداث متعددة لضمان تحديث الـ navbar
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new CustomEvent('productAddedToCart', {
          detail: { productId: product.id, productName: product.name }
        }));
        
        // Storage events
        localStorage.setItem('cartUpdated', Date.now().toString());
        localStorage.setItem('lastCartUpdate', new Date().toISOString());
        
        // Force window reload event
        window.dispatchEvent(new Event('storage'));
        
        // Manual navbar refresh attempts
        setTimeout(() => {
          window.dispatchEvent(new Event('cartUpdated'));
        }, 100);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('cartUpdated'));
        }, 500);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('cartUpdated'));
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.message || 'حدث خطأ في إضافة المنتج إلى السلة');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
    } finally {
      setAddToCartLoading(false);
    }
  };

  const increaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // ---- LIST VIEW ----
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row p-6 gap-6">
          <div className="relative w-full md:w-64 h-64 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden">
            <Link to={`/product/${createProductSlug(product.id, product.name)}`}>
              <img
                src={product.mainImage.startsWith('http') ? product.mainImage : `http://localhost:3001${product.mainImage.startsWith('/') ? product.mainImage : `/${product.mainImage}`}`}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                جديد
              </div>
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                  <span className="text-white font-semibold bg-red-600 px-4 py-2 rounded-lg text-sm">
                    نفذت الكمية
                  </span>
                </div>
              )}
            </Link>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              >
                {wishlistLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
                ) : (
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                )}
              </button>
              <Link
                to={`/product/${createProductSlug(product.id, product.name)}`}
                className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link to={`/product/${createProductSlug(product.id, product.name)}`}>
                <h3 className="text-2xl font-semibold text-gray-800 mb-3 leading-tight hover:text-pink-500 transition-colors duration-200">
                  {product.name}
                </h3>
              </Link>
              <div className="flex flex-col items-center text-center gap-1 mb-3">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-sm text-gray-400 line-through font-medium">
                        {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400">ر.س</span>
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-lg font-bold text-pink-600">
                        {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600">ر.س</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-bold text-pink-600">
                      {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600">ر.س</span>
                  </div>
                )}
              </div>
              {isOutOfStock && (
                <p className="text-base font-semibold text-red-600">نفذت الكمية</p>
              )}
            </div>
            
            {!isOutOfStock && (
              <div className="space-y-3 mt-4">
                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={addToCart}
                    disabled={addToCartLoading}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {addToCartLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>إضافة للسلة</span>
                      </>
                    )}
                  </button>
                  <Link
                    to={`/product/${createProductSlug(product.id, product.name)}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold text-base shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- GRID VIEW - SIMPLE AND CLEAN ----
  return (
    <div className="bg-white rounded-3xl border border-gray-200/60 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-72 h-[540px]">
      {/* Product Image */}
      <div className="relative h-72 overflow-hidden bg-gray-50">
        <Link to={`/product/${createProductSlug(product.id, product.name)}`}>
          <img
            src={product.mainImage.startsWith('http') ? product.mainImage : `http://localhost:3001${product.mainImage.startsWith('/') ? product.mainImage : `/${product.mainImage}`}`}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        
        {/* New Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm border border-pink-400/30">
          جديد
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white border border-white/40 transition-all duration-200"
          >
            {wishlistLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
            ) : (
              <Heart className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            )}
          </button>
          <Link
            to={`/product/${createProductSlug(product.id, product.name)}`}
            className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white border border-white/40 transition-all duration-200"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-4 py-2 rounded-xl text-sm shadow-lg">
              نفذت الكمية
            </span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col h-[244px]">
        <Link to={`/product/${createProductSlug(product.id, product.name)}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-2 leading-tight hover:text-pink-500 transition-colors duration-200 min-h-[2.5rem] line-clamp-2 text-center">
            {product.name}
          </h3>
        </Link>
        
        {/* Elegant Divider */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent rounded-full mb-2 mx-auto w-12" />
        
        {/* Price */}
        <div className="flex flex-col items-center text-center gap-1 mb-3">
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-sm text-gray-400 line-through font-medium">
                  {product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">ر.س</span>
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-lg font-bold text-pink-600">
                  {product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">ر.س</span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-lg font-bold text-pink-600">
                {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-600">ر.س</span>
            </div>
          )}
        </div>
        
        {isOutOfStock && (
          <p className="text-sm font-semibold text-red-600 mb-3">نفذت الكمية</p>
        )}
        
        {/* Actions */}
        {!isOutOfStock && (
          <div className="mt-auto space-y-2.5">
            {/* Quantity Controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold text-sm transition-colors duration-200"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-gray-800 text-sm">{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold text-sm transition-colors duration-200"
              >
                +
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              disabled={addToCartLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all duration-200 backdrop-blur-sm border border-pink-400/30 flex items-center justify-center gap-2"
            >
              {addToCartLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>إضافة للسلة</span>
                </>
              )}
            </button>
            
            {/* View Details Button */}
            <Link
              to={`/product/${product.id}`}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>عرض التفاصيل</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;