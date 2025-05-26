import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronLeft, ChevronRight, Package, Sparkles } from 'lucide-react';
import ImageSlider from './components/ImageSlider';
import ProductCard from './components/ProductCard';
import WhatsAppButton from './components/WhatsAppButton';
import cover1 from './assets/cover1.jpg';
import { createCategorySlug } from './utils/slugify';
import cover2 from './assets/cover2.jpg';
import cover3 from './assets/cover3.jpg';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  categoryId: number | null;
  productType?: string;
  dynamicOptions?: any[];
  mainImage: string;
  detailedImages?: string[];
  specifications?: { name: string; value: string }[];
  createdAt?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface CategoryProducts {
  category: Category;
  products: Product[];
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

const App: React.FC = () => {
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const heroImages = [cover1, cover2, cover3];

  useEffect(() => {
    fetchCategoriesWithProducts();
    
    // Listen for categories updates
    const handleCategoriesUpdate = () => {
      fetchCategoriesWithProducts();
    };
    
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const fetchCategoriesWithProducts = async () => {
    try {
      setLoading(true);
      const categoriesResponse = await fetch('http://localhost:3001/api/categories');
      if (!categoriesResponse.ok) throw new Error('فشل في جلب التصنيفات');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
      
      const productsResponse = await fetch('http://localhost:3001/api/products');
      if (!productsResponse.ok) throw new Error('فشل في جلب المنتجات');
      const products = await productsResponse.json();
      const categoryProductsData: CategoryProducts[] = categoriesData.map((category: Category) => ({
        category,
        products: products.filter((product: Product) => product.categoryId === category.id).slice(0, 4),
      })).filter((cp: CategoryProducts) => cp.products.length > 0);
      setCategoryProducts(categoryProductsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('فشل في تحميل البيانات');
      setLoading(false);
    }
  };



  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-rose-100/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="w-24 h-24 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-rose-500/70 rounded-full animate-spin animation-delay-150"></div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            جاري التحميل...
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 rounded-full mx-auto shadow-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 overflow-hidden" dir="rtl">
      <ToastContainer position="bottom-left" rtl />
      
      {/* Premium Hero Slider */}
      <section className="relative h-[800px] mb-20 overflow-hidden">
        <ImageSlider images={heroImages} currentIndex={currentSlide} />
        
        {/* Modern Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-pink-500/80 backdrop-blur-xl border border-white/30 text-white p-4 rounded-full hover:bg-pink-600/90 shadow-2xl z-30 group transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-pink-500/80 backdrop-blur-xl border border-white/30 text-white p-4 rounded-full hover:bg-pink-600/90 shadow-2xl z-30 group transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </section>
      
      {/* Premium Collection Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-rose-50/30 to-pink-100/40" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-8">
          {/* Premium Header with Icons */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
              <h2 className="text-6xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                مجموعاتنا المميزة
              </h2>
              <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
            <div className="h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 rounded-full mb-8 mx-auto w-64 shadow-lg" />
            <p className="text-gray-700 text-xl font-medium max-w-4xl mx-auto leading-relaxed">
              اكتشف تشكيلة متنوعة من المجموعات الحصرية المصممة خصيصاً لتناسب جميع أذواقكم الرفيعة
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-6 py-3 rounded-2xl shadow-lg">
              <Package className="w-5 h-5 text-pink-500" />
              <span className="text-gray-700 font-semibold">{categories.length} مجموعة متاحة</span>
            </div>
          </div>
          
          {/* Dynamic Categories Grid */}
          {categories.length > 0 ? (
            <div className={`grid gap-8 ${
              categories.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              categories.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
              categories.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              categories.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}>
              {categories.map((category, index) => (
                <div 
                  key={category.id} 
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link to={`/category/${createCategorySlug(category.id, category.name)}`}>
                    <div className="relative bg-gradient-to-br from-white via-pink-50/50 to-white backdrop-blur-xl rounded-3xl overflow-hidden border border-pink-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-pink-300/80">
                      
                      <div className="relative">
                        {/* Category Image */}
                        <div className="relative h-72 overflow-hidden">
                          <img
                            src={category.image ? `http://localhost:3001${category.image}` : `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format,compress&q=60&ixlib=rb-4.0.3`}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center&auto=format,compress&q=60&ixlib=rb-4.0.3`;
                            }}
                          />
                          
                          {/* Premium Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-pink-500/20 to-transparent" />
                          
                          {/* Category Number Badge */}
                          <div className="absolute top-6 right-6 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse">
                            {index + 1}
                          </div>
                        </div>
                        
                        {/* Category Info */}
                        <div className="relative p-8 bg-gradient-to-b from-white to-pink-50/30">
                          <div className="text-center">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                              {category.name}
                            </h3>
                            
                            <div className="h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full mb-4 mx-auto w-16" />
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                              {category.description || 'اكتشف مجموعة متنوعة من المنتجات عالية الجودة'}
                            </p>
                            
                            {/* Luxury Button */}
                            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-2xl font-medium hover:from-pink-600 hover:to-rose-600 shadow-lg backdrop-blur-xl border border-pink-400/30 inline-flex items-center gap-2 transition-all duration-300 hover:shadow-xl hover:scale-105">
                              <span> استكشف مجموعاتنا </span>
                              <ChevronLeft className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-16 border border-gray-300/30 shadow-2xl max-w-2xl mx-auto">
                <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-800 mb-4">لا توجد مجموعات حالياً</h3>
                <p className="text-gray-600 text-lg">سيتم إضافة مجموعات جديدة قريباً</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Premium Products Section */}
      <main className="relative container mx-auto px-8 py-20">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-50/40 via-transparent to-rose-50/40" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
        
        {categoryProducts.length > 0 ? (
  <div className="relative space-y-40">
    {categoryProducts.map((categoryProduct, sectionIndex) => (
      <section key={categoryProduct.category.id} className="relative py-12">
        {/* Section Background */}
        <div className="absolute inset-0 -mx-8 bg-gradient-to-br from-white/70 via-pink-50/40 to-white/70 rounded-3xl backdrop-blur-sm border border-pink-100/50 shadow-lg" />
        
        <div className="relative z-10">
          <div className="mb-24 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent w-32" />
              <h2 className="text-5xl font-black bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm px-6 py-2">
                {categoryProduct.category.name}
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent w-32" />
            </div>
            
            <div className="h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 rounded-full mb-10 mx-auto w-32 shadow-lg" />
            <p className="text-gray-700 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              {categoryProduct.category.description || 'مجموعة مختارة من أفضل المنتجات المصنوعة بعناية فائقة'}
            </p>
            <Link 
              to={`/category/${createCategorySlug(categoryProduct.category.id, categoryProduct.category.name)}`} 
              className="inline-flex items-center text-gray-700 hover:text-pink-600 font-semibold bg-white/90 backdrop-blur-xl border border-pink-200/60 px-8 py-3 rounded-2xl hover:bg-pink-50/80 hover:border-pink-300/80 gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>عرض جميع المنتجات</span>
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Products Container */}
          <div className="relative py-8 px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16 lg:gap-20 justify-items-center">
              {categoryProduct.products.map((product, idx) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <ProductCard
                    product={product}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ))}
  </div>
) : (
  <div className="relative text-center py-20">
    <div className="bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl p-16 border border-gray-300/30 shadow-2xl max-w-2xl mx-auto">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-pink-400/50 to-gray-300/40 p-px">
        <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
      </div>
      
      <div className="relative">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text">
          لا توجد منتجات حالياً
        </h3>
        <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-6 mx-auto w-24" />
        <p className="text-gray-600 text-lg font-light">سيتم إضافة منتجات جديدة قريباً</p>
      </div>
    </div>
  </div>
)}
      </main>

      {/* Premium Footer */}
      <footer className="relative bg-gradient-to-br from-white via-pink-50 to-rose-50 py-20 border-t border-pink-200/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-transparent to-rose-100/30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/15 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-right">
              <h3 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                GHEM.STORE
              </h3>
              <div className="h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 rounded-full mb-4 w-24 mx-auto md:mx-0 shadow-lg" />
              <p className="text-gray-700 font-medium leading-relaxed">
                متجرك المفضل لأفضل المنتجات بجودة عالية وتصميم فاخر
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="font-bold text-gray-800 mb-6 text-xl">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-700 hover:text-pink-600 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-2 rounded-2xl hover:bg-pink-50/80 hover:border-pink-300/70 inline-block transition-all duration-300 hover:scale-105">الرئيسية</Link></li>
                <li><Link to="/products" className="text-gray-700 hover:text-pink-600 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-2 rounded-2xl hover:bg-pink-50/80 hover:border-pink-300/70 inline-block transition-all duration-300 hover:scale-105">المنتجات</Link></li>
                <li><Link to="/about" className="text-gray-700 hover:text-pink-600 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-2 rounded-2xl hover:bg-pink-50/80 hover:border-pink-300/70 inline-block transition-all duration-300 hover:scale-105">من نحن</Link></li>
                <li><Link to="/contact" className="text-gray-700 hover:text-pink-600 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-2 rounded-2xl hover:bg-pink-50/80 hover:border-pink-300/70 inline-block transition-all duration-300 hover:scale-105">اتصل بنا</Link></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="font-bold text-gray-800 mb-6 text-xl">تواصل معنا</h4>
              <div className="space-y-4">
                <p className="text-gray-700 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-3 rounded-2xl hover:bg-pink-50/50 transition-all duration-300">📞 +966547493606</p>
                <p className="text-gray-700 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-3 rounded-2xl hover:bg-pink-50/50 transition-all duration-300">✉️ info@ghem.store</p>
                <p className="text-gray-700 bg-white/80 backdrop-blur-xl border border-pink-200/50 px-4 py-3 rounded-2xl hover:bg-pink-50/50 transition-all duration-300">📍 المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-pink-200/60 pt-8 text-center">
            <div className="bg-gradient-to-r from-white/80 via-pink-50/90 to-white/80 backdrop-blur-xl border border-pink-200/50 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
              <p className="text-gray-700 font-medium">
                © 2025 GHEM.STORE. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default App;