import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowRight, Package, Filter, Grid, List } from 'lucide-react';
import ProductCard from './ProductCard';
import WhatsAppButton from './WhatsAppButton';
import { extractIdFromSlug, isValidSlug } from '../utils/slugify';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
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

const CategoryPage: React.FC = () => {
  const { categoryId, slug } = useParams<{ categoryId?: string; slug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // تحديد الـ ID من slug أو categoryId
    let catId: number | null = null;
    
    if (slug) {
      // إذا كان slug موجود، استخرج الـ ID منه
      if (isValidSlug(slug)) {
        catId = extractIdFromSlug(slug);
      } else {
        toast.error('رابط التصنيف غير صحيح');
        setLoading(false);
        return;
      }
    } else if (categoryId) {
      // إذا كان categoryId موجود مباشرة
      catId = parseInt(categoryId);
    }
    
    if (catId) {
      fetchCategoryAndProducts(catId);
    }
  }, [categoryId, slug]);

  const fetchCategoryAndProducts = async (catId: number) => {
    try {
      setLoading(true);
      
      const categoryResponse = await fetch(`http://localhost:3001/api/categories/${catId}`);
      if (!categoryResponse.ok) throw new Error('فشل في جلب بيانات التصنيف');
      const categoryData = await categoryResponse.json();
      setCategory(categoryData);
      
      const productsResponse = await fetch('http://localhost:3001/api/products');
      if (!productsResponse.ok) throw new Error('فشل في جلب المنتجات');
      const allProducts = await productsResponse.json();
      
      const categoryProducts = allProducts.filter((product: Product) => product.categoryId === catId);
      setProducts(categoryProducts);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('فشل في تحميل البيانات');
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-f8f5f0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">جاري تحميل المنتجات...</h2>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-f8f5f0 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">التصنيف غير موجود</h2>
          <Link 
            to="/" 
            className="inline-block bg-gold-600 text-cream-50 px-6 py-3 rounded-lg hover:bg-gold-700 transition-all duration-300"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-f8f5f0" dir="rtl">
      <div className="container mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gold-600 hover:text-gold-700 transition-colors">
              الرئيسية
            </Link>
            <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
            <span className="text-gray-600">{category.name}</span>
          </div>
        </nav>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {category.name}
            </h1>
            <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-cream-50" />
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Sort */}
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300"
              >
                <option value="name">ترتيب حسب الاسم</option>
                <option value="price-low">السعر: من الأقل إلى الأعلى</option>
                <option value="price-high">السعر: من الأعلى إلى الأقل</option>
              </select>
            </div>

            {/* View Mode & Results Count */}
            <div className="flex items-center gap-4">
              <div className="text-gray-600">
                <span className="font-semibold text-gold-600">{products.length}</span> منتج
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-semibold">عرض:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-gold-100 text-gold-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-gold-100 text-gold-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24 justify-items-center px-8' 
              : 'space-y-6'
          }`}>
            {sortedProducts.map((product) => (
              <div key={product.id} className="flex justify-center">
                <ProductCard
                  product={product}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">لا توجد منتجات في هذا التصنيف</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              سيتم إضافة منتجات جديدة لهذا التصنيف قريباً
            </p>
            <Link
              to="/"
              className="inline-block bg-gold-600 text-cream-50 px-8 py-3 rounded-lg hover:bg-gold-700 transition-all duration-300 font-semibold"
            >
              العودة للرئيسية
            </Link>
          </div>
        )}
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default CategoryPage;