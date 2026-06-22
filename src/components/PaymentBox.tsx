import React, { useState } from "react";
import { MessageCircle, QrCode, Shield, CheckCircle, Smartphone, ExternalLink, Copy, Calendar, Sparkles, Check } from "lucide-react";

export default function PaymentBox() {
  const upiId = "genius.jaya01@okhdfcbank"; 
  const whatsappLink = "https://wa.link/6xtft4";
  const paymentAmount = "999"; 
  const formattedAmount = "999.00";
  const payeeName = "jaya aggarwal";

  // Real UPI deep link format for Indian users paying on mobile or generating high-resolution QR code
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${formattedAmount}&cu=INR&tn=Gitas%20Wisdom%20Yearly%20Subscription`;
  
  // Real secure QR generator URL via standard QRServer API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiDeepLink)}`;

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(paymentAmount);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#fffefc] to-[#faf6ed] rounded-3xl p-6 border-2 border-amber-300 shadow-lg space-y-6 animate-fade-in my-6 relative overflow-hidden">
      
      {/* Visual Top Decorative Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

      {/* Header Info */}
      <div className="text-center space-y-2 border-b border-amber-200/50 pb-5">
        <span className="bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-200/70 inline-flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          गहन मार्गदर्शन • YEARLY SUBSCRIPTION ACCESS • 1 साल का पूर्ण प्रवेश
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#5d4037] leading-tight mt-1">
          पवित्र जीवन मार्गदर्शन दक्षिणा
        </h3>
        <p className="text-stone-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
          आपका पहला सवाल बिल्कुल मुफ्त था। आगे पूरे वर्ष अपने जीवन की हर उलझन का दिव्य समाधान, उत्तम उपाय तथा असीमित भक्तिपूर्ण परामर्श पाने के लिए दक्षिणा पूरी करें।
        </p>
      </div>

      {/* Subscription Benefits Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
        <div className="flex flex-col items-center justify-center p-1 space-y-1">
          <Calendar className="w-5 h-5 text-amber-700" />
          <span className="text-xs font-black text-[#5d4037] uppercase tracking-wide">३६५ दिन की वैधता</span>
          <p className="text-[11px] text-stone-500 font-medium">1 वर्ष तक पूर्ण असीमित सेवा</p>
        </div>
        <div className="flex flex-col items-center justify-center p-1 space-y-1 border-t sm:border-t-0 sm:border-x border-amber-200">
          <Sparkles className="w-5 h-5 text-amber-700 animate-bounce" />
          <span className="text-xs font-black text-[#5d4037] uppercase tracking-wide">असीमित प्रश्न (Unlimited)</span>
          <p className="text-[11px] text-stone-500 font-medium font-sans">Use this app multiple times over the year</p>
        </div>
        <div className="flex flex-col items-center justify-center p-1 space-y-1">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <span className="text-xs font-black text-[#5d4037] uppercase tracking-wide">व्यक्तिगत सहायता</span>
          <p className="text-[11px] text-stone-500 font-medium">व्हाट्सएप पर सीधा जीवन परामर्श</p>
        </div>
      </div>

      {/* Grid: QR Code & Payment Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* GOOGLE PAY AUTHENTIC SCANNER CARD */}
        <div className="bg-[#f1f3f4] p-4 sm:p-5 rounded-3xl border border-stone-200 flex flex-col items-center justify-center shadow-md">
          
          {/* Main GPay White Card Frame */}
          <div className="bg-white w-full max-w-[270px] rounded-2xl px-5 py-6 shadow-sm border border-[#e0e0e0] flex flex-col items-center text-center relative select-none">
            
            {/* GPAY User Header */}
            <div className="flex items-center justify-center gap-2 mb-4 w-full">
              {/* Saffron G-Initial Avatar */}
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-base shadow-inner font-mono shrink-0">
                G
              </div>
              <div className="text-left overflow-hidden">
                <span className="text-base font-sans font-semibold text-[#3c4043] tracking-tight block truncate">
                  {payeeName}
                </span>
              </div>
            </div>

            {/* REAL DYNAMIC SCANNABLE QR CODE IMAGE */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-inner relative flex items-center justify-center overflow-hidden hover:scale-[1.02] transition-transform">
              <img 
                src={qrCodeImageUrl} 
                alt="UPI QR Code" 
                className="w-48 h-48 block object-contain"
                referrerPolicy="no-referrer"
              />
              {/* Decorative Subtle Overlay frame */}
              <div className="absolute inset-0 border border-dashed border-amber-300 pointer-events-none rounded-2xl m-1.5 opacity-60"></div>
            </div>

            {/* Payee Details & Pricing Box */}
            <div className="mt-4 pt-1 space-y-2 w-full">
              <p className="text-xs text-stone-500 font-sans tracking-wide">
                UPI ID: <span className="font-bold text-[#202124] select-all cursor-all-scroll">{upiId}</span>
              </p>
              
              <div className="bg-amber-50/65 py-2 px-3 rounded-xl border border-amber-200/50">
                <div className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">वार्षिक सदस्यता शुल्क • Yearly Fee</div>
                <div className="text-xl font-sans font-black text-[#5d4037] flex items-center justify-center gap-1 mt-0.5">
                  ₹{formattedAmount} <span className="text-xs font-semibold text-stone-500 font-sans mb-1">/ year</span>
                </div>
              </div>

              <div className="text-[10px] text-green-700 font-semibold flex items-center justify-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" /> १ साल तक बिल्कुल असीमित उपयोग
              </div>
            </div>

          </div>

          {/* Actionable Mobile Fallback & Copy Triggers */}
          <div className="w-full max-w-[270px] space-y-2 mt-3.5">
            {/* Direct App Launch Button for Mobile Viewers! */}
            <a
              href={upiDeepLink}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-2.5 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              Pay Direct from Phone (UPI Apps)
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyUpi}
                className="bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-bold py-2 px-1 rounded-lg border border-stone-200 flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                {copiedUpi ? "Copied!" : "Copy UPI ID"}
              </button>
              <button
                type="button"
                onClick={handleCopyAmount}
                className="bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-bold py-2 px-1 rounded-lg border border-stone-200 flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                {copiedAmount ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                {copiedAmount ? "Copied!" : `Copy ₹${paymentAmount}`}
              </button>
            </div>
          </div>

        </div>

        {/* Step-by-Step Payment Process & Value Statement */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-[#e67e22] tracking-wider flex items-center gap-1">
            <CheckCircle className="w-4.5 h-4.5 text-[#e67e22] shrink-0" />
            भुगतान निर्देश (3 Easy Steps to Activate):
          </h4>
          
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3 items-start">
              <span className="w-5.5 h-5.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="text-xs sm:text-sm text-stone-800 font-bold leading-relaxed">
                  ऊपर दिए गए QR को स्कैन करें
                </p>
                <p className="text-stone-500 text-[11px] font-medium leading-relaxed mt-0.5">
                  अपने मोबाइल के किसी भी पेमेंट ऐप (<strong>Google Pay, PhonePe, Paytm, BHIM</strong>) से QR कोड स्कैन करें, अथवा मोबाइल से सीधे भुगतान के लिए 'Pay Direct' बटन दबाएँ।
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 items-start">
              <span className="w-5.5 h-5.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-xs sm:text-sm text-stone-800 font-bold leading-relaxed">
                  केवल ₹{paymentAmount} का सुरक्षित भुगतान पूरा करें
                </p>
                <p className="text-stone-500 text-[11px] font-medium leading-relaxed mt-0.5 font-sans">
                  By paying ₹{paymentAmount} once, you get a full <strong>Yearly Subscription (365 Days)</strong>. Ask questions unlimited times, use this app whenever you require divine guidance!
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 items-start bg-amber-50/80 rounded-2xl p-3 border border-amber-200/50 shadow-xs">
              <span className="w-5.5 h-5.5 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">3</span>
              <div className="space-y-1 flex-1">
                <p className="text-xs sm:text-sm text-[#5d4037] font-black leading-relaxed">
                  व्हाट्सएप पर स्क्रीनशॉट भेजें
                </p>
                <p className="text-stone-605 text-[11px] font-bold leading-relaxed mt-0.5">
                  सफल पेमेंट का एक स्क्रीनशॉट लेकर नीचे दिए गए व्हाट्सएप बटन को दबाएँ और हमें सेंड करें। हम तुरंत आपके खाते की जीवनकाल/वार्षिक वैधता सक्रिय कर देंगे!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* WhatsApp Button Actions with the REQUIRED NEW Link! */}
      <div className="pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row gap-3 items-center justify-center sm:justify-between">
        
        <div className="flex items-center gap-2 text-stone-500 text-xs font-bold">
          <Smartphone className="w-4 h-4 text-amber-700" />
          <span>व्हाट्सएप एक्टिवेशन कोड • wa.link/6xtft4</span>
        </div>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba56] text-white font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 animate-pulse shrink-0" />
          <span>✅ व्हाट्सएप पर स्क्रीनशॉट भेजें (Activate Yearly Subscription)</span>
          <ExternalLink className="w-4 h-4 opacity-85" />
        </a>

      </div>

    </div>
  );
}
