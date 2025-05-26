import React from 'react';

const Partners: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-16" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-800 mb-4">
            شركاؤنا
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نفتخر بشراكتنا مع أفضل المؤسسات والجامعات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-4xl">🏛️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 text-center">
                شريك رقم {item}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;