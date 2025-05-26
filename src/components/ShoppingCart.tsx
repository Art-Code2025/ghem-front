import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShoppingCart as CartIcon, Plus, Minus, Trash2, Package, Sparkles, ArrowRight, Heart, Edit3, X, Check } from 'lucide-react';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  optionsPricing?: Record<string, number>;
  attachments?: {
    images?: string[];
    text?: string;
  };
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    mainImage: string;
    detailedImages?: string[];
    stock: number;
    productType?: string;
    dynamicOptions?: ProductOption[];
    specifications?: { name: string; value: string }[];
    sizeGuideImage?: string;
  };
}

interface ProductOption {
  optionName: string;
  optionType: 'select' | 'text' | 'number' | 'radio';
  required: boolean;
  options?: OptionValue[];
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface OptionValue {
  value: string;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSizeGuideProduct, setSelectedSizeGuideProduct] = useState<CartItem | null>(null);
  const [selectedImageModal, setSelectedImageModal] = useState<{ item: CartItem; imageIndex: number } | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editingOptions, setEditingOptions] = useState<Record<string, string>>({});
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingAttachmentImages, setEditingAttachmentImages] = useState<File[]>([]);

  // تشخيص حالة البيانات
  console.log('🛒 ShoppingCart Component State:', {
    cartItemsCount: cartItems.length,
    loading,
    updating,
    expandedItem,
    userData: localStorage.getItem('user') ? 'exists' : 'missing'
  });

  useEffect(() => {
    // إنشاء مستخدم تجريبي إذا لم يكن موجود (للاختبار فقط)
    if (!localStorage.getItem('user')) {
      const testUser = {
        id: 1,
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'test@example.com',
        phone: '0123456789'
      };
      localStorage.setItem('user', JSON.stringify(testUser));
      console.log('🛒 Created test user for cart testing:', testUser);
    }
    
    // إضافة بيانات تجريبية للكارت إذا كان فارغ
    addTestDataToCart();
    
    fetchCart();
    
    // مستمع لتحديث الخيارات من صفحة المنتج
    const handleOptionsUpdate = (event: CustomEvent) => {
      const { productId, options, source } = event.detail;
      if (source === 'product') {
        console.log(`🔄 Updating cart options from product page for product ${productId}:`, options);
        // تحديث الخيارات في الكارت إذا كان المنتج موجود
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.productId === productId 
              ? { ...item, selectedOptions: { ...item.selectedOptions, ...options } }
              : item
          )
        );
      }
    };
    
    window.addEventListener('productOptionsUpdated', handleOptionsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('productOptionsUpdated', handleOptionsUpdate as EventListener);
    };
  }, []);

  // دالة لإضافة بيانات تجريبية للكارت
  const addTestDataToCart = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      
      // التحقق من وجود عناصر في الكارت
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`);
      if (response.ok) {
        const cartData = await response.json();
        if (cartData.length > 0) {
          console.log('🛒 Cart already has items, skipping test data');
          return;
        }
      }
      
      console.log('🛒 Adding test data to cart...');
      
      // إضافة منتج تجريبي 1 - وشاح وكاب مع خيارات كاملة
      await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          quantity: 1,
          selectedOptions: {
            nameOnSash: 'أحمد محمد الطالب',
            embroideryColor: 'ذهبي',
            capFabric: 'حرير',
            size: 'متوسط',
            color: 'أسود'
          },
          attachments: {
            text: 'يرجى التأكد من جودة التطريز والخط واضح ومقروء. الاسم يجب أن يكون بالخط الذهبي اللامع.'
          }
        })
      });
      
      // إضافة منتج تجريبي 2 - جاكيت مع خيارات مفصلة
      await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 2,
          quantity: 1,
          selectedOptions: {
            size: 'كبير',
            color: 'كحلي',
            embroideryColor: 'فضي',
            fabric: 'قطن'
          },
          attachments: {
            text: 'أريد الجاكيت بمقاس كبير مريح، واللون كحلي غامق. التطريز بالفضي على الصدر.'
          }
        })
      });
      
      // إضافة منتج تجريبي 3 - عباية تخرج
      await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 3,
          quantity: 1,
          selectedOptions: {
            size: 'متوسط',
            color: 'أسود',
            embroideryColor: 'ذهبي',
            nameOnSash: 'فاطمة أحمد'
          },
          attachments: {
            text: 'عباية تخرج للبنات، مقاس متوسط، مع تطريز ذهبي أنيق. الاسم على الوشاح بخط جميل.'
          }
        })
      });
      
      console.log('🛒 Test data added successfully');
    } catch (error) {
      console.error('🛒 Error adding test data:', error);
    }
  };

  // تحديث العدادات عند تحميل البيانات
  useEffect(() => {
    if (cartItems.length > 0) {
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      
      // التحقق من وجود المستخدم المسجل دخوله
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.log('🛒 No user logged in, cart is empty');
        setCartItems([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        console.log('🛒 Invalid user data, cart is empty');
        setCartItems([]);
        setLoading(false);
        return;
      }

      console.log(`🛒 Fetching cart for user ${user.id}...`);
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`);
      if (!response.ok) {
        throw new Error('فشل في جلب سلة التسوق');
      }
      const data = await response.json();
      console.log(`🛒 Cart loaded: ${data.length} items`);
      console.log('🛒 Cart data:', data);
      
      // التحقق من بيانات كل عنصر
      data.forEach((item: any, index: number) => {
        console.log(`🛒 Item ${index + 1}:`, {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions,
          attachments: item.attachments,
          product: item.product
        });
      });
      
      setCartItems(data);
      setLoading(false);
    } catch (error) {
      console.error('🛒 Error fetching cart:', error);
      toast.error('فشل في جلب سلة التسوق');
      setCartItems([]);
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    try {
      setUpdating(true);
      
      // التحقق من وجود المستخدم المسجل دخوله
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        setUpdating(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        setUpdating(false);
        return;
      }

      // العثور على المنتج في العربة للحصول على productId
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem) {
        toast.error('المنتج غير موجود في السلة');
        setUpdating(false);
        return;
      }

      console.log(`🛒 Updating quantity for user ${user.id}, product ${cartItem.productId}`);
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: cartItem.productId, quantity: newQuantity })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تحديث الكمية');
      }
      
      console.log('🛒 Quantity updated successfully');
      window.dispatchEvent(new Event('cartUpdated'));
      await fetchCart();
    } catch (error) {
      console.error('🛒 Error updating quantity:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في تحديث الكمية');
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setUpdating(true);
      
      // التحقق من وجود المستخدم المسجل دخوله
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        setUpdating(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        setUpdating(false);
        return;
      }

      // العثور على المنتج في العربة للحصول على productId
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem) {
        toast.error('المنتج غير موجود في السلة');
        setUpdating(false);
        return;
      }

      console.log(`🛒 Removing product ${cartItem.productId} from user ${user.id} cart`);
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart/product/${cartItem.productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في حذف المنتج من السلة');
      }
      
      console.log('🛒 Product removed successfully');
      toast.success('تم حذف المنتج من السلة');
      window.dispatchEvent(new Event('cartUpdated'));
      await fetchCart();
    } catch (error) {
      console.error('🛒 Error removing from cart:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في حذف المنتج من السلة');
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('هل أنت متأكد من إفراغ سلة التسوق؟')) return;
    
    try {
      setUpdating(true);
      
      // التحقق من وجود المستخدم المسجل دخوله
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        setUpdating(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        toast.error('يجب تسجيل الدخول أولاً');
        setUpdating(false);
        return;
      }

      console.log(`🛒 Clearing cart for user ${user.id}`);
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إفراغ السلة');
      }
      
      console.log('🛒 Cart cleared successfully');
      toast.success('تم إفراغ سلة التسوق');
      window.dispatchEvent(new Event('cartUpdated'));
      await fetchCart();
    } catch (error) {
      console.error('🛒 Error clearing cart:', error);
      toast.error(error instanceof Error ? error.message : 'فشل في إفراغ السلة');
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantity * item.product.price), 0);
  };

  const calculateItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatOptionName = (optionName: string): string => {
    const optionNames: { [key: string]: string } = {
      nameOnSash: 'الاسم على الوشاح',
      embroideryColor: 'لون التطريز',
      capFabric: 'قماش الكاب',
      size: 'المقاس',
      color: 'اللون',
      capColor: 'لون الكاب',
      dandoshColor: 'لون الدندوش',
      fabric: 'نوع القماش',
      length: 'الطول',
      width: 'العرض'
    };
    return optionNames[optionName] || optionName;
  };

  const getOptionDisplayName = (optionName: string): string => {
    const names: Record<string, string> = {
      nameOnSash: 'الاسم على الوشاح',
      embroideryColor: 'لون التطريز',
      capFabric: 'قماش الكاب',
      size: 'المقاس',
      color: 'اللون',
      capColor: 'لون الكاب',
      dandoshColor: 'لون الدندوش'
    };
    return names[optionName] || optionName;
  };

  const formatOptionValue = (optionName: string, value: string): string => {
    const colorTranslations: { [key: string]: string } = {
      gold: 'ذهبي',
      silver: 'فضي',
      black: 'أسود',
      white: 'أبيض',
      red: 'أحمر',
      blue: 'أزرق',
      navy: 'كحلي',
      gray: 'رمادي',
      brown: 'بني',
      burgundy: 'عنابي',
      pink: 'وردي',
      green: 'أخضر',
      purple: 'بنفسجي',
      cotton: 'قطن',
      silk: 'حرير',
      polyester: 'بوليستر',
      wool: 'صوف',
      small: 'صغير',
      medium: 'متوسط',
      large: 'كبير',
      xlarge: 'كبير جداً'
    };
    
    return colorTranslations[value] || value;
  };

  // دالة لتحديد صورة المقاس المناسبة
  const getSizeGuideImage = (productType: string): string => {
    const sizeGuideImages = {
      'جاكيت': '/src/assets/size1.png',
      'عباية تخرج': '/src/assets/size2.png', 
      'مريول مدرسي': '/src/assets/size3.png'
    };
    return sizeGuideImages[productType as keyof typeof sizeGuideImages] || '/src/assets/size1.png';
  };

  // دالة لتوسيع/طي تفاصيل المنتج
  const toggleItemExpansion = (itemId: number) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  // دالة لعرض دليل المقاسات
  const showSizeGuideModal = (item: CartItem) => {
    setSelectedSizeGuideProduct(item);
    setShowSizeGuide(true);
    // منع التمرير في الخلفية
    document.body.style.overflow = 'hidden';
  };

  // دالة لعرض الصور في مودال
  const showImageModal = (item: CartItem, imageIndex: number) => {
    setSelectedImageModal({ item, imageIndex });
  };

  // دالة لفتح مودال تعديل الخيارات
  const openEditModal = (item: CartItem) => {
    setEditingItem(item);
    // منع التمرير في الخلفية
    document.body.style.overflow = 'hidden';
    
    // تحميل الخيارات المحفوظة من localStorage أولاً، ثم من الكارت
    const savedOptions = localStorage.getItem(`productOptions_${item.productId}`);
    let initialOptions = item.selectedOptions || {};
    
    if (savedOptions) {
      try {
        const parsedOptions = JSON.parse(savedOptions);
        // دمج الخيارات: localStorage له الأولوية، ثم خيارات الكارت
        initialOptions = { ...initialOptions, ...parsedOptions };
        console.log(`🔄 Loaded options from localStorage for product ${item.productId}:`, parsedOptions);
      } catch (error) {
        console.error('Error parsing saved options:', error);
      }
    }
    
    // إذا لم توجد خيارات، تعيين قيم افتراضية من dynamicOptions
    if (item.product.dynamicOptions && Object.keys(initialOptions).length === 0) {
      const defaultOptions: Record<string, string> = {};
      item.product.dynamicOptions.forEach((option: ProductOption) => {
        if (option.options && option.options.length > 0) {
          defaultOptions[option.optionName] = option.options[0].value;
        }
      });
      initialOptions = { ...defaultOptions, ...initialOptions };
      console.log(`🔧 Set default options for product ${item.productId}:`, defaultOptions);
    }
    
    setEditingOptions(initialOptions);
    setEditingNotes(item.attachments?.text || '');
    setEditingAttachmentImages([]); // إعادة تعيين الصور
    
    console.log(`📝 Opening edit modal for product ${item.productId} with options:`, initialOptions);
  };

  // دوال التعامل مع الصور في التعديل
  const handleEditAttachmentImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEditingAttachmentImages(prev => [...prev, ...files]);
  };

  const removeEditAttachmentImage = (index: number) => {
    setEditingAttachmentImages(prev => prev.filter((_, i) => i !== index));
  };

  // دالة للتحقق من اكتمال البيانات المطلوبة لعنصر واحد
  const validateRequiredFields = (item: CartItem): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];
    
    if (item.product.dynamicOptions) {
      item.product.dynamicOptions.forEach((option: ProductOption) => {
        if (option.required) {
          const value = editingOptions[option.optionName];
          if (!value || value.trim() === '') {
            missingFields.push(getOptionDisplayName(option.optionName));
          }
        }
      });
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  // دالة للتحقق من جميع العناصر في الكارت
  const validateAllCartItems = (): { isValid: boolean; invalidItems: { item: CartItem; missingFields: string[] }[] } => {
    const invalidItems: { item: CartItem; missingFields: string[] }[] = [];
    
    cartItems.forEach(item => {
      const missingFields: string[] = [];
      
      if (item.product.dynamicOptions) {
        item.product.dynamicOptions.forEach((option: ProductOption) => {
          if (option.required) {
            const value = item.selectedOptions?.[option.optionName];
            if (!value || value.trim() === '') {
              missingFields.push(getOptionDisplayName(option.optionName));
            }
          }
        });
      }
      
      if (missingFields.length > 0) {
        invalidItems.push({ item, missingFields });
      }
    });
    
    return {
      isValid: invalidItems.length === 0,
      invalidItems
    };
  };

  // دالة لحفظ التغييرات
  const saveEditedOptions = async () => {
    if (!editingItem) return;
    
    // التحقق من اكتمال البيانات المطلوبة
    const validation = validateRequiredFields(editingItem);
    if (!validation.isValid) {
      toast.error(`يرجى إكمال البيانات المطلوبة: ${validation.missingFields.join(', ')}`);
      return;
    }
    
    try {
      setUpdating(true);
      
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('يجب تسجيل الدخول أولاً');
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch(`http://localhost:3001/api/user/${user.id}/cart/update-options`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: editingItem.productId,
          selectedOptions: editingOptions,
          attachments: {
            text: editingNotes,
            images: editingAttachmentImages.map(file => file.name)
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث الخيارات');
      }
      
      // حفظ الخيارات في localStorage للمشاركة مع صفحة المنتج
      localStorage.setItem(`productOptions_${editingItem.productId}`, JSON.stringify(editingOptions));
      
      // إرسال إشعار للصفحات الأخرى بتحديث الخيارات
      window.dispatchEvent(new CustomEvent('productOptionsUpdated', {
        detail: { 
          productId: editingItem.productId, 
          options: editingOptions,
          source: 'cart'
        }
      }));
      
      console.log(`✅ Options updated for product ${editingItem.productId}:`, editingOptions);
      console.log(`💾 Options saved to localStorage: productOptions_${editingItem.productId}`);
      
      toast.success('تم تحديث الخيارات بنجاح! ✨ الخيارات متزامنة مع صفحة المنتج');
      setEditingItem(null);
      setEditingOptions({});
      setEditingNotes('');
      setEditingAttachmentImages([]);
      document.body.style.overflow = 'auto';
      await fetchCart();
    } catch (error) {
      console.error('Error updating options:', error);
      toast.error('فشل في تحديث الخيارات');
    } finally {
      setUpdating(false);
    }
  };

  // Animation styles
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-fade-in { animation: fadeIn 0.6s ease forwards; }
    .animate-slide-in { animation: slideIn 0.6s ease forwards; }
    .shimmer-effect::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 2s infinite;
    }
    .glass-effect {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <style>{animationStyles}</style>
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="animate-float">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent mb-2">
              جاري تحميل سلة التسوق...
            </h2>
            <p className="text-gray-600">نجهز لك منتجاتك المختارة</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    // التحقق من وجود مستخدم مسجل
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    
    console.log('🛒 Cart is empty, user data:', user);
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl">
        <style>{animationStyles}</style>
        <div className="glass-effect rounded-3xl shadow-2xl p-12 text-center max-w-md mx-auto border-2 border-gray-900 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <CartIcon className="w-12 h-12 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
              سلة التسوق فارغة
            </span>
          </h2>
          
          {!user ? (
            <div className="mb-8">
              <p className="text-gray-600 mb-4 leading-relaxed">يجب تسجيل الدخول أولاً لعرض سلة التسوق</p>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <p className="text-gray-700 text-sm">🔐 سجل دخولك لتتمكن من إضافة المنتجات إلى السلة</p>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-gray-600 mb-4 leading-relaxed">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
                <p className="text-gray-700 text-sm">👋 مرحباً {user.firstName}! ابدأ التسوق الآن</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-4">
            <Link 
              to="/products" 
              className="relative bg-gradient-to-r from-gray-900 to-black text-white px-8 py-3 rounded-2xl hover:from-black hover:to-gray-800 font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden inline-flex items-center gap-3"
            >
              <span className="relative z-10">استعرض المنتجات</span>
              <Sparkles className="w-5 h-5 relative z-10" />
              <div className="absolute inset-0 bg-white/20 transform translate-x-full hover:-translate-x-0 transition-transform duration-500 shimmer-effect"></div>
            </Link>
            
            {/* Debug Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <div className="font-bold text-yellow-800 mb-2">معلومات التشخيص:</div>
              <div className="text-yellow-700">
                <div>حالة التحميل: {loading ? 'جاري التحميل...' : 'مكتمل'}</div>
                <div>عدد العناصر: {cartItems.length}</div>
                <div>المستخدم: {localStorage.getItem('user') ? 'مسجل دخول' : 'غير مسجل'}</div>
                {localStorage.getItem('user') && (
                  <div>معرف المستخدم: {JSON.parse(localStorage.getItem('user') || '{}').id || 'غير محدد'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <style>{animationStyles}</style>
      
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-900 to-black rounded-2xl flex items-center justify-center animate-float">
              <CartIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
              سلة التسوق
            </h1>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-gray-900 to-black mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 mb-4">
            لديك {calculateItemsCount()} منتج في سلة التسوق
          </p>
          
          {/* New Features Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 max-w-4xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">✨</span>
              <h3 className="text-lg font-bold text-blue-800">ميزات جديدة!</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-blue-700">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span>تعديل خيارات المنتج من الكارت</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span>تزامن مع صفحة المنتج    </span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                <span>دليل المقاسات التفاعلي    </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl shadow-2xl border-2 border-gray-900 overflow-hidden animate-slide-in">
              <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <h2 className="text-xl font-bold">منتجاتك المختارة</h2>
                  </div>
                  <button
                    onClick={clearCart}
                    disabled={updating}
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    إفراغ السلة
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-6">
                  {cartItems.map((item, index) => {
                    // التحقق من وجود بيانات مطلوبة ناقصة لهذا العنصر
                    const missingFields: string[] = [];
                    if (item.product.dynamicOptions) {
                      item.product.dynamicOptions.forEach((option: ProductOption) => {
                        if (option.required) {
                          const value = item.selectedOptions?.[option.optionName];
                          if (!value || value.trim() === '') {
                            missingFields.push(getOptionDisplayName(option.optionName));
                          }
                        }
                      });
                    }
                    const hasIncompleteData = missingFields.length > 0;

                    return (
                      <div 
                        key={item.id} 
                        className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                          hasIncompleteData 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-200'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* تحذير البيانات الناقصة */}
                        {hasIncompleteData && (
                          <div className="bg-red-100 border-b border-red-200 px-6 py-3">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">!</span>
                              <span className="text-sm font-medium text-red-700">
                                يرجى إكمال البيانات المطلوبة: {missingFields.join(', ')}
                              </span>
                            </div>
                          </div>
                        )}
                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={`http://localhost:3001${item.product.mainImage}`} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-4">
                            {/* Product Name and Price */}
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.product.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold text-gray-900">{item.product.price} ر.س</span>
                                  {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                                    <span className="text-sm text-gray-400 line-through">{item.product.originalPrice} ر.س</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                disabled={updating}
                                className="w-8 h-8 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Dynamic Product Options - نفس خيارات صفحة المنتج بالضبط */}
                            {item.product.dynamicOptions && item.product.dynamicOptions.length > 0 && (
                              <div className="space-y-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-2">⚙️</span>
                                    خيارات المنتج
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-green-600 font-medium">متزامن مع صفحة المنتج</span>
                                  </div>
                                </h4>
                                
                                {item.product.dynamicOptions.map((option: ProductOption, index) => (
                                  <div key={index} className="space-y-3 bg-white rounded-lg p-3 border border-gray-200">
                                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                                      <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs mr-2">
                                        {option.required ? '!' : '?'}
                                      </span>
                                      {getOptionDisplayName(option.optionName)}
                                      {option.required && <span className="text-red-500 mr-1">*</span>}
                                    </label>
                                    
                                    {option.optionType === 'select' && option.options && (
                                      <div className="space-y-2">
                                        {item.selectedOptions?.[option.optionName] ? (
                                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                              <span className="text-sm font-medium text-green-800">
                                                {item.selectedOptions[option.optionName]}
                                              </span>
                                            </div>
                                            <button 
                                              onClick={() => openEditModal(item)}
                                              className="text-blue-600 text-sm hover:text-blue-700 bg-blue-100 px-3 py-1 rounded-lg border border-blue-300 transition-all duration-200"
                                            >
                                              تعديل
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                              <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                                              <span className="text-sm text-yellow-800">
                                                لم يتم اختيار {getOptionDisplayName(option.optionName)}
                                              </span>
                                            </div>
                                            <button 
                                              onClick={() => openEditModal(item)}
                                              className="text-blue-600 text-sm hover:text-blue-700 bg-blue-100 px-3 py-1 rounded-lg border border-blue-300 transition-all duration-200"
                                            >
                                              اختر الآن
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {option.optionType === 'text' && (
                                      <div className="space-y-2">
                                        {item.selectedOptions?.[option.optionName] ? (
                                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                              <span className="text-sm font-medium text-green-800">
                                                "{item.selectedOptions[option.optionName]}"
                                              </span>
                                            </div>
                                            <button 
                                              onClick={() => openEditModal(item)}
                                              className="text-blue-600 text-sm hover:text-blue-700 bg-blue-100 px-3 py-1 rounded-lg border border-blue-300 transition-all duration-200"
                                            >
                                              تعديل
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                              <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                                              <span className="text-sm text-yellow-800">
                                                لم يتم إدخال {getOptionDisplayName(option.optionName)}
                                              </span>
                                            </div>
                                            <button 
                                              onClick={() => openEditModal(item)}
                                              className="text-blue-600 text-sm hover:text-blue-700 bg-blue-100 px-3 py-1 rounded-lg border border-blue-300 transition-all duration-200"
                                            >
                                              أدخل الآن
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Size Guide Link - Only for size option and specific product types */}
                                    {option.optionName === 'size' && 
                                     (item.product.productType === 'جاكيت' || item.product.productType === 'عباية تخرج' || item.product.productType === 'مريول مدرسي') && (
                                      <div className="mt-2">
                                        <button
                                          onClick={() => showSizeGuideModal(item)}
                                          className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                        >
                                          <span className="text-sm">📐</span>
                                          <span>دليل المقاسات</span>
                                          <div className="w-4 h-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                                            <span className="text-xs">👁️</span>
                                          </div>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Attachments */}
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <div className="text-sm font-medium text-purple-700 mb-2 flex items-center justify-between">
                                <span>المرفقات:</span>
                                <button 
                                  onClick={() => openEditModal(item)}
                                  className="text-blue-600 text-xs hover:text-blue-700"
                                >
                                  إضافة ملاحظات
                                </button>
                              </div>
                              {item.attachments && item.attachments.text ? (
                                <div className="text-sm text-purple-600 mb-2">
                                  <span className="font-medium">ملاحظات:</span> {item.attachments.text}
                                </div>
                              ) : (
                                <div className="text-sm text-purple-500 italic mb-2">
                                  لا توجد ملاحظات
                                </div>
                              )}
                              {item.attachments && item.attachments.images && item.attachments.images.length > 0 ? (
                                <div className="text-sm text-purple-600">
                                  <span className="font-medium">صور مرفقة:</span> {item.attachments.images.length} صورة
                                </div>
                              ) : (
                                <div className="text-sm text-purple-500 italic">
                                  لا توجد صور مرفقة
                                </div>
                              )}
                            </div>

                            {/* Quantity and Total */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">الكمية:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={updating || item.quantity <= 1}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-1 font-medium text-gray-800 bg-gray-50 min-w-12 text-center">
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={updating || item.quantity >= item.product.stock}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Total Price */}
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  المجموع: {(item.quantity * item.product.price).toFixed(2)} ر.س
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl shadow-2xl border-2 border-gray-900 p-6 sticky top-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                  ملخص الطلب
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 glass-effect rounded-xl border border-gray-900">
                  <span className="text-gray-700 font-semibold">عدد المنتجات</span>
                  <span className="font-bold text-base text-gray-800">{calculateItemsCount()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 glass-effect rounded-xl border border-gray-900">
                  <span className="text-gray-700 font-semibold">المجموع الفرعي</span>
                  <span className="font-bold text-base text-gray-800">{calculateTotal().toFixed(2)} ر.س</span>
                </div>
                
                <div className="border-t-2 border-gray-900 pt-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-900">
                    <span className="text-lg font-bold text-gray-800">المجموع الكلي</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
                      {calculateTotal().toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  const validation = validateAllCartItems();
                  if (!validation.isValid) {
                    // عرض رسالة تفصيلية عن العناصر الناقصة
                    const errorMessages = validation.invalidItems.map(({ item, missingFields }) => 
                      `${item.product.name}: ${missingFields.join(', ')}`
                    );
                    toast.error(
                      `يرجى إكمال البيانات المطلوبة للمنتجات التالية:\n${errorMessages.join('\n')}`,
                      { autoClose: 8000 }
                    );
                    return;
                  }
                  // إذا كانت جميع البيانات مكتملة، انتقل للدفع
                  window.location.href = '/checkout';
                }}
                className="block w-full py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl hover:from-black hover:to-gray-800 font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>إتمام الطلب</span>
                  <ArrowRight className="w-4 h-4 transform rotate-180" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform translate-x-full hover:-translate-x-0 transition-transform duration-500 shimmer-effect"></div>
              </button>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block w-full mt-3 py-2 border-2 border-gray-900 text-gray-900 rounded-2xl hover:bg-gray-100 font-semibold text-center transition-all duration-300"
              >
                متابعة التسوق
              </Link>

              {/* Features */}
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-gray-50 rounded-xl border border-gray-900">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Package className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="font-semibold">توصيل سريع ومضمون</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-gray-900">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Heart className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="font-semibold">خدمة عملاء متميزة</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-900">
                  <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="font-semibold">ضمان الجودة والأصالة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && selectedSizeGuideProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={() => {
            setShowSizeGuide(false);
            document.body.style.overflow = 'auto';
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-6xl max-h-[95vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-800">جدول المقاسات - {selectedSizeGuideProduct.product.name}</h3>
                <button
                  onClick={() => {
              setShowSizeGuide(false);
              document.body.style.overflow = 'auto';
            }}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              <div className="text-center">
                <img
                  src={getSizeGuideImage(selectedSizeGuideProduct.product.productType || '')}
                  alt="دليل المقاسات"
                  className="max-w-full h-auto rounded-xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-size-guide.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Options Modal */}
      {editingItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          style={{ zIndex: 9998 }}
          onClick={() => {
            setEditingItem(null);
            document.body.style.overflow = 'auto';
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">تعديل خيارات المنتج</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-green-600 font-medium">متزامن مع صفحة المنتج</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    document.body.style.overflow = 'auto';
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">{editingItem.product.name}</h4>
                <div className="text-sm text-gray-600">السعر: {editingItem.product.price} ر.س</div>
              </div>

              <div className="space-y-6">
                {/* Product Info Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`http://localhost:3001${editingItem.product.mainImage}`}
                      alt={editingItem.product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{editingItem.product.name}</h4>
                      <p className="text-sm text-gray-600">{editingItem.product.productType}</p>
                      <p className="text-sm font-medium text-green-600">السعر: {editingItem.product.price} ر.س</p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Options - نفس خيارات صفحة المنتج بالضبط */}
                {editingItem.product.dynamicOptions && editingItem.product.dynamicOptions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-2">⚙️</span>
                      خيارات المنتج
                    </h3>
                    
                    {editingItem.product.dynamicOptions.map((option: ProductOption, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                            {option.required ? '!' : '?'}
                          </span>
                          {getOptionDisplayName(option.optionName)}
                          {option.required && <span className="text-red-500 mr-1">*</span>}
                        </label>
                        
                        {option.optionType === 'select' && option.options && (
                          <div className="space-y-3">
                            <select
                              value={editingOptions[option.optionName] || ''}
                              onChange={(e) => setEditingOptions({...editingOptions, [option.optionName]: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                            >
                              <option value="">اختر {getOptionDisplayName(option.optionName)}</option>
                              {option.options.map((opt, optIndex) => (
                                <option key={optIndex} value={opt.value}>
                                  {opt.value}
                                </option>
                              ))}
                            </select>
                            
                            {/* Current Selection Display */}
                            {editingOptions[option.optionName] && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                  <span className="text-sm font-medium text-green-800">
                                    تم اختيار: {editingOptions[option.optionName]}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {option.optionType === 'text' && (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingOptions[option.optionName] || ''}
                              onChange={(e) => setEditingOptions({...editingOptions, [option.optionName]: e.target.value})}
                              placeholder={option.placeholder || `أدخل ${getOptionDisplayName(option.optionName)}`}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                            
                            {/* Current Input Display */}
                            {editingOptions[option.optionName] && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                                  <span className="text-sm font-medium text-green-800">
                                    تم إدخال: "{editingOptions[option.optionName]}"
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {/* Validation Info */}
                            {option.validation && (
                              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                                {option.validation.minLength && (
                                  <div>الحد الأدنى: {option.validation.minLength} أحرف</div>
                                )}
                                {option.validation.maxLength && (
                                  <div>الحد الأقصى: {option.validation.maxLength} أحرف</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Size Guide Link - Only for size option and specific product types */}
                        {option.optionName === 'size' && 
                         (editingItem.product.productType === 'جاكيت' || editingItem.product.productType === 'عباية تخرج' || editingItem.product.productType === 'مريول مدرسي') && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => showSizeGuideModal(editingItem)}
                              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                              <span className="text-lg">📐</span>
                              <span>عرض جدول المقاسات</span>
                              <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                                <span className="text-xs">👁️</span>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes/Attachments */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm mr-2">📝</span>
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="أضف أي ملاحظات خاصة بالمنتج، طلبات تخصيص، أو تعليمات خاصة..."
                    rows={4}
                  />
                  {editingNotes && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                        <span className="text-sm font-medium text-green-800">
                          تم إضافة ملاحظات ({editingNotes.length} حرف)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Attachment Images */}
                  <div className="mt-4">
                    <label className="block text-md font-semibold text-gray-700 mb-3 flex items-center">
                      <span className="w-5 h-5 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xs mr-2">📷</span>
                      صور إضافية (اختياري)
                    </label>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <input
                          type="file"
                          onChange={handleEditAttachmentImagesChange}
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="editAttachmentImages"
                        />
                        <label htmlFor="editAttachmentImages" className="cursor-pointer">
                          <div className="flex items-center gap-2 p-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 transition-colors bg-purple-50 hover:bg-purple-100">
                            <span className="text-lg">📷</span>
                            <span className="text-sm text-purple-700 font-medium">إضافة صور</span>
                          </div>
                        </label>
                      </div>
                      {editingAttachmentImages.length > 0 && (
                        <span className="text-xs text-purple-600 bg-purple-100 px-3 py-2 rounded-lg font-medium">
                          {editingAttachmentImages.length} صورة
                        </span>
                      )}
                    </div>

                    {editingAttachmentImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {editingAttachmentImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`مرفق ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border border-purple-200"
                            />
                            <button
                              onClick={() => removeEditAttachmentImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={saveEditedOptions}
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>حفظ التغييرات</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    document.body.style.overflow = 'auto';
                  }}
                  disabled={updating}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4"
          style={{ zIndex: 9997 }}
          onClick={() => setSelectedImageModal(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 z-10"
            >
              ✕
            </button>
            
            <div className="bg-white rounded-2xl p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {selectedImageModal.item.product.name}
              </h3>
              
              <div className="text-center">
                <img
                  src={selectedImageModal.imageIndex === 0 
                    ? `http://localhost:3001${selectedImageModal.item.product.mainImage}`
                    : `http://localhost:3001${selectedImageModal.item.product.detailedImages?.[selectedImageModal.imageIndex - 1]}`
                  }
                  alt={`صورة ${selectedImageModal.imageIndex + 1}`}
                  className="max-w-full h-auto rounded-xl shadow-lg"
                />
              </div>
              
              {/* Image Navigation */}
              {selectedImageModal.item.product.detailedImages && selectedImageModal.item.product.detailedImages.length > 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => setSelectedImageModal({
                      ...selectedImageModal,
                      imageIndex: 0
                    })}
                    className={`w-12 h-12 rounded border-2 overflow-hidden transition-all duration-300 ${
                      selectedImageModal.imageIndex === 0 ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={`http://localhost:3001${selectedImageModal.item.product.mainImage}`}
                      alt="صورة رئيسية"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {selectedImageModal.item.product.detailedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageModal({
                        ...selectedImageModal,
                        imageIndex: index + 1
                      })}
                      className={`w-12 h-12 rounded border-2 overflow-hidden transition-all duration-300 ${
                        selectedImageModal.imageIndex === index + 1 ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={`http://localhost:3001${image}`}
                        alt={`صورة ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;