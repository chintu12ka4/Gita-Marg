import React from "react";
import { MessageCircle, QrCode, Shield, CheckCircle, Smartphone } from "lucide-react";

export default function PaymentBox() {
  const upiId = "gitawisdom@upi"; // Easily customizable UPI ID
  const whatsappNumber = "+919999999999"; // Easily customizable WhatsApp Number
  const paymentAmount = "21"; // Easily customizable amount

  // Custom pre-filled whatsapp message
  const whatsappMessage = encodeURIComponent(
    `नमस्ते! मैंने अभी गीतामार्गदर्शन के लिए ₹${paymentAmount} का भुगतान किया है। मुझे अपना दूसरा सवाल पूछना है।`
  );
  
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-gradient-to-br from-[#fffdf9] to-[#faf5eb] rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-5 animate-fade-in my-6">
      
      {/* Header Info */}
      <div className="text-center space-y-2 border-b border-amber-200/50 pb-4">
        <span className="bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          गहरी बातचीत और आगे का मार्गदर्शन • Next Advice Setup
        </span>
        <h3 className="text-xl font-serif font-black text-[#5d4037] leading-tight mt-1">
          आगे का मार्गदर्शन पाने के लिए दक्षिणा दें
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm font-medium">
          आपका पहला मार्गदर्शन बिल्कुल मुफ्त (Free) था। आगे अन्य सवाल पूछने के लिए या व्हाट्सएप पर सीधे बात करने के लिए छोटा सा भुगतान करें।
        </p>
      </div>

      {/* Grid: QR Code & Payment Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* QR Code Visual */}
        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl border border-amber-200 shadow-xs relative">
          
          {/* Scan frame border */}
          <div className="absolute inset-2 border-2 border-dashed border-amber-300/40 rounded-xl pointer-events-none"></div>
          
          {/* SVG Vector QR Code representation to look real */}
          <svg viewBox="0 0 200 200" className="w-40 h-40 text-[#5d4037]" fill="currentColor">
            {/* Background */}
            <rect x="0" y="0" width="200" height="200" fill="white" />
            
            {/* Top-Left Finder Pattern */}
            <rect x="10" y="10" width="45" height="45" />
            <rect x="15" y="15" width="35" height="35" fill="white" />
            <rect x="20" y="20" width="25" height="25" />
            
            {/* Top-Right Finder Pattern */}
            <rect x="145" y="10" width="45" height="45" />
            <rect x="150" y="15" width="35" height="35" fill="white" />
            <rect x="155" y="20" width="25" height="25" />
            
            {/* Bottom-Left Finder Pattern */}
            <rect x="10" y="145" width="45" height="45" />
            <rect x="15" y="150" width="35" height="35" fill="white" />
            <rect x="20" y="155" width="25" height="25" />

            {/* Bottom-Right alignment pattern */}
            <rect x="150" y="150" width="15" height="15" />
            <rect x="153" y="153" width="9" height="9" fill="white" />
            <rect x="156" y="156" width="3" height="3" />

            {/* Random QR pixels simulation */}
            <rect x="70" y="10" width="10" height="10" />
            <rect x="70" y="30" width="15" height="10" />
            <rect x="95" y="15" width="10" height="15" />
            <rect x="120" y="10" width="15" height="10" />
            <rect x="120" y="35" width="10" height="20" />
            
            <rect x="10" y="70" width="15" height="10" />
            <rect x="35" y="70" width="20" height="15" />
            <rect x="10" y="95" width="10" height="20" />
            <rect x="30" y="100" width="25" height="10" />
            
            <rect x="145" y="70" width="15" height="15" />
            <rect x="175" y="70" width="15" height="10" />
            <rect x="150" y="95" width="10" height="25" />
            <rect x="170" y="110" width="20" height="10" />

            <rect x="70" y="70" width="60" height="60" />
            <rect x="80" y="80" width="40" height="40" fill="white" />
            {/* G-Logo or Rupee sign in the center of QR */}
            <text x="100" y="108" fontSize="24" fontWeight="black" textAnchor="middle" fill="#e67e22" fontFamily="sans-serif">₹</text>

            <rect x="70" y="145" width="20" height="10" />
            <rect x="70" y="165" width="15" height="25" />
            <rect x="100" y="150" width="10" height="15" />
            <rect x="100" y="175" width="20" height="10" />
            <rect x="130" y="145" width="10" height="20" />
            <rect x="130" y="175" width="15" height="15" />
          </svg>

          {/* Amount and scan label */}
          <div className="mt-3 text-center">
            <p className="text-stone-800 font-extrabold text-sm flex items-center justify-center gap-1">
              <QrCode className="w-4 h-4 text-amber-700 animate-spin-slow" />
              Scan QR to Pay: <span className="text-amber-800 text-base">₹{paymentAmount} Only</span>
            </p>
            <p className="text-stone-400 text-[10px] font-mono mt-0.5">UPI ID: {upiId}</p>
          </div>
        </div>

        {/* Step-by-Step Payment Process */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-[#e67e22] tracking-wider">
            भुगतान कैसे करें? (3 Easy Steps):
          </h4>
          
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p className="text-xs text-stone-700 font-semibold leading-relaxed">
                ऊपर दिए गए QR कोड को अपने फ़ोन के किसी भी पेमेंट ऐप (<strong>Google Pay, PhonePe, Paytm, BHIM</strong>) से स्कैन करें।
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p className="text-xs text-stone-700 font-semibold leading-relaxed">
                स्कैन करके केवल <strong>₹{paymentAmount}</strong> का सुरक्षित भुगतान (Pay) करें और पेमेंट का एक स्क्रीनशॉट ले लें।
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex gap-2.5 items-start bg-amber-50 rounded-xl p-2.5 border border-amber-200/50">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div className="space-y-1">
                <p className="text-xs text-stone-805 font-bold leading-relaxed">
                  नीचे दिए गए व्हाट्सएप बटन को दबाएँ और लिया हुआ स्क्रीनशॉट हमें भेज दें। हम तुरंत आपका मार्गदर्शन शुरू कर देंगे।
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* WhatsApp Button Actions */}
      <div className="pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
          <Smartphone className="w-4 h-4 text-amber-700" />
          <span>व्हाट्सएप नंबर: <strong className="text-stone-700">{whatsappNumber}</strong></span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba56] text-white font-extrabold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-sm cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 animate-bounce" />
          <span>✅ व्हाट्सएप पर स्क्रीनशॉट भेजें (Click to Send on WhatsApp)</span>
        </a>

      </div>

    </div>
  );
}
