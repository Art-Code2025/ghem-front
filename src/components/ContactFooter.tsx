import React from 'react';
import { Phone, Mail, MapPin, ExternalLink, Users, Headphones, UserCheck } from 'lucide-react';

const ContactSection = () => {
  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/place/24%C2%B045'04.5%22N+46%C2%B043'12.1%22E/@24.7512609,46.7200274,17z",
      "_blank"
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 py-20 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 via-transparent to-gray-900/5" />
      
      <div className="relative container mx-auto px-4">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-5xl font-black text-gray-800 mb-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text">
              تواصل معنا
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full mb-6" />
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg font-light leading-relaxed">
            نحن دائماً في خدمتكم بأعلى مستويات الجودة والاحترافية. يمكنكم التواصل معنا من خلال أي من الوسائل التالية
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Premium Location Card */}
          <div 
            className="group relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 cursor-pointer border border-gray-300/30 shadow-2xl hover:shadow-pink-400/20"
            onClick={openGoogleMaps}
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-pink-400/50 to-gray-300/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
            </div>
            
            <div className="relative p-8">
              <div className="bg-gradient-to-br from-pink-400/20 to-rose-400/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-gray-300/30">
                <MapPin className="w-10 h-10 text-gray-700 drop-shadow-lg" />
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">الموقع الحالي</h3>
              
              <div className="text-center">
                <p className="text-gray-600 text-base mb-6 leading-relaxed">طريق الملك عبدالله، المملكة العربية السعودية</p>
                <button className="mx-auto flex items-center justify-center text-white font-medium bg-gradient-to-r from-pink-500 to-rose-500 backdrop-blur-xl border border-pink-400/30 py-3 px-6 rounded-2xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <ExternalLink className="w-5 h-5 ml-2" />
                  <span>افتح في الخريطة</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Premium Email Card */}
          <div className="group relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 border border-gray-300/30 shadow-2xl hover:shadow-pink-400/20">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 via-transparent to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-gray-400/50 to-gray-300/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
            </div>
            
            <div className="relative p-8">
              <div className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-gray-300/30">
                <Mail className="w-10 h-10 text-gray-700 drop-shadow-lg" />
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">البريد الإلكتروني</h3>
              
              <div className="w-full">
                <a href="mailto:info@ghem.store" 
                   className="flex items-center justify-center space-x-1 space-x-reverse py-4 px-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-300/40 hover:bg-white/80 transition-all duration-300 group/email">
                  <Users className="w-5 h-5 text-gray-700 ml-2 group-hover/email:scale-110 transition-transform duration-300" />
                  <span className="text-gray-800 hover:text-gray-600 transition-colors text-base font-medium">info@ghem.store</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Premium Phone Numbers Card */}
          <div className="group relative bg-gradient-to-br from-white/80 via-amber-50/50 to-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 border border-gray-300/30 shadow-2xl hover:shadow-pink-400/20">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-transparent to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium Border Gradient */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-300/40 via-pink-400/50 to-gray-300/40 p-px">
              <div className="w-full h-full bg-gradient-to-br from-white/90 via-amber-50/90 to-white/90 rounded-3xl" />
            </div>
            
            <div className="relative p-8">
              <div className="bg-gradient-to-br from-pink-400/20 to-rose-400/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-gray-300/30">
                <Phone className="w-10 h-10 text-gray-700 drop-shadow-lg" />
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">أرقام الجوال</h3>
              
              <div className="w-full space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-pink-400/20 to-rose-400/20 backdrop-blur-xl border border-gray-300/30 px-4 py-2 rounded-2xl mb-3">
                    <Headphones className="w-4 h-4 text-gray-700 ml-2" />
                    <span className="text-gray-800 font-medium text-sm">خدمة العملاء</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {["0563995580", "0502116888", "0547493606"].map((phone, index) => (
                    <a key={index} href={`tel:${phone}`} 
                       className="flex items-center justify-center py-3 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-300/40 hover:bg-white/80 transition-all duration-300 group/phone">
                      <span className="text-gray-800 hover:text-gray-600 transition-colors font-medium text-base group-hover/phone:scale-105 transition-transform duration-300">{phone}</span>
                    </a>
                  ))}
                </div>
                
                <div className="border-t border-gray-300/40 pt-4 mt-6">
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center justify-center bg-gradient-to-r from-gray-400/20 to-gray-600/20 backdrop-blur-xl border border-gray-300/30 px-4 py-2 rounded-2xl mb-3">
                      <Users className="w-4 h-4 text-gray-700 ml-2" />
                      <span className="text-gray-800 font-medium text-sm">أرقام الإدارة</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium text-sm mb-2">مدير الفرع</p>
                      <a href="tel:0502532888" 
                         className="flex items-center justify-center py-3 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-300/40 hover:bg-white/80 transition-all duration-300 group/phone">
                        <span className="text-gray-800 hover:text-gray-600 transition-colors text-base group-hover/phone:scale-105 transition-transform duration-300">0502532888</span>
                      </a>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-600 font-medium text-sm mb-2">مدير إدارة المشاريع</p>
                      <a href="tel:0505242177" 
                         className="flex items-center justify-center py-3 rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-300/40 hover:bg-white/80 transition-all duration-300 group/phone">
                        <span className="text-gray-800 hover:text-gray-600 transition-colors text-base group-hover/phone:scale-105 transition-transform duration-300">0505242177</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="relative py-8 mt-16 border-t border-gray-300/30 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-100/30 to-transparent" />
        <div className="relative">
          <a 
            href="https://www.instagram.com/artc.ode39?igsh=OG0xOGltcmM0djV6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-600 text-sm font-medium hover:text-gray-800 transition-all duration-300 bg-white/60 backdrop-blur-xl border border-gray-300/40 px-6 py-3 rounded-2xl hover:bg-white/80 transform hover:scale-105"
          >
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent font-bold">ArtCode</span>
            <span className="mx-2">-</span>
            <span>2025</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ContactSection;