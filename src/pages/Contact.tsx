import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50" dir="rtl">
      <div className="container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center animate-float">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              تواصل معنا
            </h1>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن هنا لخدمتكم. تواصلوا معنا لأي استفسارات أو طلبات خاصة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-pink-800 mb-6">معلومات التواصل</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">رقم الهاتف</h3>
                    <p className="text-gray-600">+966547493606</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">البريد الإلكتروني</h3>
                    <p className="text-gray-600">info@zahristore.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">الموقع</h3>
                    <p className="text-gray-600">المملكة العربية السعودية</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">ساعات العمل</h3>
                    <p className="text-gray-600">السبت - الخميس: 9 صباحاً - 6 مساءً</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Notice */}
            <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 border border-pink-200">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-bold text-pink-800">ملاحظة هامة</h3>
              </div>
              <p className="text-pink-700 font-medium text-center">
                مدة التنفيذ للطلبات: 45-50 يوماً
              </p>
              <p className="text-gray-600 text-sm mt-2 text-center">
                يرجى التخطيط مسبقاً لضمان وصول طلبكم في الوقت المناسب
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">أرسل لنا رسالة</h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                  placeholder="موضوع الرسالة"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 font-bold text-lg shadow-lg"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Additional Info */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
          <h3 className="text-2xl font-bold text-pink-800 mb-6">تابعونا على وسائل التواصل</h3>
          
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="text-white text-xl">📱</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="text-white text-xl">📧</span>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="text-white text-xl">📞</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-pink-800">ZAHRI.STORE</span> - براند سعودي لعبايات التخرج
          </p>
          <p className="text-gray-500 mt-2">نشارككم الفرحة</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
