import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CategoryAdd: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('mainImage', formData.image);
      }

      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('فشل في إضافة التصنيف');
      }

      toast.success('تم إضافة التصنيف بنجاح!');
      // Trigger a refresh in the main app
      window.dispatchEvent(new Event('categoriesUpdated'));
      navigate('/admin?tab=categories');
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل في إضافة التصنيف');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50" dir="rtl">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin?tab=categories" className="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة إلى التصنيفات
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-bold ml-3">
                  +
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">إضافة تصنيف جديد</h1>
                  <p className="text-sm text-gray-500">إنشاء تصنيف جديد لتنظيم المنتجات</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
              📂 إدارة التصنيفات
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <span className="w-6 h-6 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-orange-600 text-sm ml-3">📝</span>
                  معلومات التصنيف
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* اسم التصنيف */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    اسم التصنيف *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                    placeholder="أدخل اسم التصنيف"
                  />
                </div>

                {/* وصف التصنيف */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                    وصف التصنيف *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200 resize-none"
                    placeholder="أدخل وصف مفصل للتصنيف وما يحتويه من منتجات"
                  />
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جارٍ الحفظ...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        حفظ التصنيف
                      </>
                    )}
                  </button>
                  
                  <Link
                    to="/admin?tab=categories"
                    className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium text-center"
                  >
                    إلغاء
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Image Upload Sidebar */}
          <div className="space-y-6">
            {/* صورة التصنيف */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <span className="w-6 h-6 bg-white bg-opacity-30 rounded-lg flex items-center justify-center text-purple-600 text-sm ml-3">🖼️</span>
                  صورة التصنيف
                </h2>
              </div>
              
              <div className="p-6">
                {formData.image ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="معاينة"
                        className="w-full h-48 object-cover rounded-xl shadow-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                        title="إزالة الصورة"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{formData.image.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(formData.image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                    <input
                      id="image"
                      name="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="text-purple-500 mb-4">
                        <svg className="mx-auto h-16 w-16" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-900">ارفع صورة التصنيف</p>
                        <p className="text-sm text-gray-600">اسحب وأفلت أو انقر للاختيار</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF حتى 10MB</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0">
                  💡
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">نصائح مفيدة</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• اختر اسم واضح ومميز للتصنيف</li>
                    <li>• اكتب وصف مفصل يوضح نوع المنتجات</li>
                    <li>• استخدم صورة عالية الجودة وواضحة</li>
                    <li>• تأكد من أن الصورة مناسبة لمحتوى التصنيف</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAdd; 