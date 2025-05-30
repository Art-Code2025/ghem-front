import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  addedAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    mainImage: string;
    stock: number;
    description: string;
  };
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/wishlist`);
      if (!response.ok) throw new Error('فشل في جلب قائمة الأمنيات');
      const data = await response.json();
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('فشل في جلب قائمة الأمنيات');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: number, productName: string) => {
    try {
      setRemoving(itemId);
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        setRemoving(null);
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        setRemoving(null);
        return;
      }
      const wishlistItem = wishlistItems.find(item => item.id === itemId);
      if (!wishlistItem) {
        toast.error('المنتج غير موجود في قائمة الأمنيات');
        setRemoving(null);
        return;
      }
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/wishlist/product/${wishlistItem.product.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في حذف المنتج من قائمة الأمنيات');
      }
      toast.success(`تم حذف "${productName}" من قائمة الأمنيات`);
      window.dispatchEvent(new Event('wishlistUpdated'));
      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في حذف المنتج من قائمة الأمنيات');
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (productId: number, productName: string) => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إضافة المنتج إلى سلة التسوق');
      }
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`تم إضافة "${productName}" إلى سلة التسوق!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في إضافة المنتج إلى سلة التسوق');
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm('هل أنت متأكد من إفراغ قائمة الأمنيات؟')) return;
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }
      for (const item of wishlistItems) {
        await fetch(`http://localhost:3001/api/user/${user.id}/wishlist/product/${item.product.id}`, { method: 'DELETE' });
      }
      toast.success('تم إفراغ قائمة الأمنيات');
      window.dispatchEvent(new Event('wishlistUpdated'));
      setWishlistItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('فشل في إفراغ قائمة الأمنيات');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="w-20 h-20 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-500/50 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text">
            جاري تحميل قائمة الأمنيات...
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 py-20 overflow-hidden" dir="rtl">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/5 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-16 border border-gray-300/30 shadow-2xl">
              {/* Premium Border Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-pink-400/50 to-gray-300/40 p-px">
                <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
              </div>
              
              <div className="relative">
                {/* Premium Icon */}
                <div className="text-8xl mb-8 bg-gradient-to-br from-pink-400 via-rose-400 to-pink-600 bg-clip-text text-transparent">
                  💝
                </div>
                
                <h2 className="text-4xl font-black text-gray-800 mb-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text">
                  قائمة الأمنيات فارغة
                </h2>
                
                <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-8 mx-auto w-32" />
                
                <p className="text-gray-600 mb-12 leading-relaxed text-lg font-light">
                  لم تقم بإضافة أي منتجات إلى قائمة الأمنيات الخاصة بك بعد. 
                  ابدأ بتصفح المتجر وأضف منتجاتك المفضلة!
                </p>
                
                <div className="space-y-4">
                  <Link 
                    to="/products" 
                    className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-2xl hover:from-pink-600 hover:to-rose-600 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl backdrop-blur-xl"
                  >
                    🛍️ تصفح المنتجات
                  </Link>
                  <Link 
                    to="/" 
                    className="block w-full bg-gradient-to-r from-white/60 to-gray-100/80 backdrop-blur-xl border border-gray-300/50 text-gray-800 px-10 py-4 rounded-2xl hover:from-white/80 hover:to-gray-100/90 font-bold text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    🏠 العودة للرئيسية
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 py-20 overflow-hidden" dir="rtl">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 via-transparent to-gray-900/5" />
      
      <div className="relative container mx-auto px-8 max-w-7xl">
        {/* Premium Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-black text-gray-800 mb-4 flex items-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text">
                <span className="ml-4 text-6xl bg-gradient-to-br from-pink-400 via-rose-400 to-pink-600 bg-clip-text text-transparent">💝</span>
                قائمة الأمنيات
              </h1>
              <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-4 w-48" />
              <p className="text-gray-600 text-xl font-light">
                لديك {wishlistItems.length} منتج في قائمة الأمنيات
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg backdrop-blur-xl border border-red-500/30"
              >
                <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                إفراغ القائمة
              </button>
            )}
          </div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-8 text-center border border-gray-300/30 shadow-xl group hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative">
                <div className="text-4xl mb-4 bg-gradient-to-br from-pink-400 to-rose-400 bg-clip-text text-transparent">🛍️</div>
                <h3 className="text-3xl font-bold text-gray-800">{wishlistItems.length}</h3>
                <p className="text-gray-600">منتج محفوظ</p>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-8 text-center border border-gray-300/30 shadow-xl group hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 via-transparent to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative">
                <div className="text-4xl mb-4 bg-gradient-to-br from-gray-600 to-gray-800 bg-clip-text text-transparent">💰</div>
                <h3 className="text-3xl font-bold text-gray-700">
                  {wishlistItems.reduce((total, item) => total + item.product.price, 0).toFixed(2)} ر.س
                </h3>
                <p className="text-gray-600">القيمة الإجمالية</p>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-8 text-center border border-gray-300/30 shadow-xl group hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative">
                <div className="text-4xl mb-4 bg-gradient-to-br from-pink-400 to-rose-400 bg-clip-text text-transparent">📊</div>
                <h3 className="text-3xl font-bold text-pink-500">
                  {wishlistItems.filter(item => item.product.stock > 0).length}
                </h3>
                <p className="text-gray-600">متوفر للشراء</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {wishlistItems.map(item => (
            <div key={item.id} className="group relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 border border-gray-300/30 shadow-2xl hover:shadow-pink-400/20">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Premium Border Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-pink-400/50 to-gray-300/40 p-px">
                <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
              </div>

              {/* Product Image */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={`http://localhost:3001${item.product.mainImage}`} 
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Stock Status */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-xl border ${
                  item.product.stock > 0 
                    ? 'bg-green-100/80 text-green-800 border-green-300/50' 
                    : 'bg-red-100/80 text-red-800 border-red-300/50'
                }`}>
                  {item.product.stock > 0 ? `متوفر (${item.product.stock})` : 'غير متوفر'}
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id, item.product.name)}
                  disabled={removing === item.id}
                  className="absolute top-4 left-4 w-12 h-12 bg-red-100/80 backdrop-blur-xl border border-red-300/50 text-red-600 rounded-2xl hover:bg-red-200/80 transition-all duration-300 flex items-center justify-center group/btn shadow-lg"
                  title="حذف من قائمة الأمنيات"
                >
                  {removing === item.id ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
                
                {/* Date Badge */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xl text-white px-3 py-1 rounded-2xl text-sm border border-gray-300/20">
                  {new Date(item.addedAt).toLocaleDateString('ar-SA')}
                </div>
              </div>

              {/* Product Info */}
              <div className="relative p-6">
                <Link 
                  to={`/product/${item.product.id}`}
                  className="block hover:text-gray-600 transition-colors"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{item.product.name}</h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.product.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    {item.product.price.toFixed(2)} ر.س
                  </div>
                  <Link 
                    to={`/product/${item.product.id}`}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium bg-white/60 backdrop-blur-xl border border-gray-300/40 px-4 py-2 rounded-2xl transition-all duration-300"
                  >
                    عرض التفاصيل ←
                  </Link>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(item.product.id, item.product.name)}
                    disabled={item.product.stock === 0}
                    className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                      item.product.stock > 0
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg backdrop-blur-xl'
                        : 'bg-gray-300/60 text-gray-500 cursor-not-allowed backdrop-blur-xl border border-gray-400/30'
                    }`}
                  >
                    {item.product.stock > 0 ? (
                      <>
                        <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        أضف للسلة
                      </>
                    ) : 'غير متوفر'}
                  </button>
                  
                  <Link
                    to={`/product/${item.product.id}`}
                    className="px-4 py-3 bg-white/60 backdrop-blur-xl border border-gray-300/40 text-gray-700 rounded-2xl hover:bg-white/80 font-medium transition-all duration-300"
                  >
                    👁️
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Quick Actions */}
        <div className="mt-16 text-center">
          <div className="relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-12 max-w-4xl mx-auto border border-gray-300/30 shadow-2xl">
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-pink-400/50 to-gray-300/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
            </div>
            
            <div className="relative">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text">
                🎯 إجراءات سريعة
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-8 mx-auto w-32" />
              <p className="text-gray-600 mb-8 text-lg font-light">اكتشف المزيد من المنتجات أو أكمل عملية الشراء</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/products" 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-2xl hover:from-pink-600 hover:to-rose-600 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-xl"
                >
                  🔍 اكتشف المزيد
                </Link>
                <Link 
                  to="/cart" 
                  className="bg-gradient-to-r from-white/60 to-gray-100/80 backdrop-blur-xl border border-gray-300/50 text-gray-800 px-10 py-4 rounded-2xl hover:from-white/80 hover:to-gray-100/90 font-bold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  🛒 عرض السلة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;