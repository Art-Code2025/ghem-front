import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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

const ProductsByCategory: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
    fetchProductsByCategory();
  }, [id, slug]);

  const fetchCategory = async () => {
    // تحديد الـ ID من slug أو id
    let categoryId: string | undefined;
    
    if (slug) {
      // إذا كان slug موجود، استخرج الـ ID منه
      if (isValidSlug(slug)) {
        categoryId = extractIdFromSlug(slug).toString();
      } else {
        toast.error('رابط التصنيف غير صحيح');
        return;
      }
    } else if (id) {
      // إذا كان id موجود مباشرة
      categoryId = id;
    } else {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب التصنيف');
      }
      
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('فشل في جلب التصنيف');
    }
  };

  const fetchProductsByCategory = async () => {
    // تحديد الـ ID من slug أو id
    let categoryId: string | undefined;
    
    if (slug) {
      // إذا كان slug موجود، استخرج الـ ID منه
      if (isValidSlug(slug)) {
        categoryId = extractIdFromSlug(slug).toString();
      } else {
        return;
      }
    } else if (id) {
      // إذا كان id موجود مباشرة
      categoryId = id;
    } else {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/products/category/${categoryId}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب المنتجات');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('فشل في جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      {category && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">لا توجد منتجات في هذا التصنيف.</p>
          <Link to="/" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-24">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      )}

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default ProductsByCategory; 