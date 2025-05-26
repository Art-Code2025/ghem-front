import React from 'react';

const Media: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-16" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            معرض الصور
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            استعرض مجموعة من أفضل أعمالنا وتصاميمنا المميزة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                <span className="text-6xl">🎓</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  تصميم رقم {item}
                </h3>
                <p className="text-gray-600">
                  وصف قصير للتصميم والعمل المعروض
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Media;