import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Volume2, VolumeX, AlertCircle, Mic, MicOff, RefreshCw, Lock, ShieldCheck } from "lucide-react";
import GitaLoader from "./components/GitaLoader";
import GuidanceDisplay from "./components/GuidanceDisplay";
import PaymentBox from "./components/PaymentBox";
import { AppLogo } from "./components/AppLogo";
import { GuidanceResult } from "./types";

const SUGGESTIONS = [
  {
    category: "Career",
    label: "काम और नौकरी की चिंता (Job/Work Tension)",
    problem: "मुझे अपने काम या नौकरी को लेकर बहुत तनाव रहता है। मेहनत के बाद भी फल नहीं मिल पा रहा और आगे क्या होगा इस बात का डर सताता है।"
  },
  {
    category: "Relationships",
    label: "घर-परिवार या दोस्तों से अनबन (Relationship Problem)",
    problem: "मेरे परिवार और करीबियों के साथ आजकल बहुत बहस और तनाव रहता है। मैं मन को शांत रखना चाहता हूँ पर गुस्सा काबू नहीं होता।"
  },
  {
    category: "Health",
    label: "मन में अशांति और घबराहट (Mind/Anxiety Struggle)",
    problem: "मैं लगातार सोचता रहता हूँ जिससे मुझे बेहद घबराहट होती है और नींद नहीं आती। मन को शांत और खुश कैसे रखूँ?"
  }
];

const INITIAL_DEMO_VERSE: GuidanceResult = {
  shlokaSanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
  shlokaTransliterated: "Karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi",
  chapterAndVerse: "अध्याय २, श्लोक ४७",
  shlokaMeaning: "तुम्हारा अधिकार सिर्फ अपना फ़र्ज़ (काम) करने पर है, उसका क्या नतीजा निकलेगा उसपर तुम्हारा कोई बस नहीं है। इसलिए नतीजे की चिंता किए बिना अपना कर्म करो।",
  problemAnalysis: "भगवान कृष्ण कह रहे हैं कि इस समय आप कल की चिंता में आज का कीमती पल गँवा रहे हैं। आपके हाथ में सिर्फ मेहनत करना है, उसका नतीजा आपके वश में नहीं है। चिंता करना छोड़िए और अपना काम पूरे मन से कीजिए।",
  actionableGuidance: [
    "नतीजे के बारे में सोचना बंद करें और सिर्फ आज के काम पर ध्यान दें।",
    "मन को शांत करने के लिए दिन में कम से कम ५ मिनट आँखें बंद कर के गहरी सांसें लें।",
    "यह विश्वास रखें कि जो भी होगा, वह आपके भले के लिए ही होगा। चिंता से कुछ नहीं बदलता।"
  ],
  summaryNote: "काम पूरे मन से करो, नतीजे की चिंता श्री कृष्ण पर छोड़ दो। मन शांत रहेगा।"
};

export default function App() {
  const [problemText, setProblemText] = useState("");
  const [currentProblemForDisplay, setCurrentProblemForDisplay] = useState("");
  const [category, setCategory] = useState("Career");
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [adviceCount, setAdviceCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("gita_advice_count") || "0", 10);
    }
    return 0;
  });

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const isListeningRef = useRef(false);
  const originalTextRef = useRef("");

  // Setup Web Speech recognition (Voice Typing)
  useEffect(() => {
    let recInstance: any = null;
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;

        rec.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
        };

        rec.onresult = (event: any) => {
          let sessionTranscript = "";
          for (let i = 0; i < event.results.length; ++i) {
            sessionTranscript += event.results[i][0].transcript;
          }
          const base = originalTextRef.current.trim();
          if (sessionTranscript) {
            setProblemText(base ? `${base} ${sessionTranscript.trim()}` : sessionTranscript.trim());
          }
        };

        rec.onerror = (event: any) => {
          if (event.error === "aborted") {
            console.log("Speech recognition aborted safely.");
          } else {
            console.warn("Speech error:", event.error || event);
          }
        };

        rec.onend = () => {
          setIsListening(false);
          isListeningRef.current = false;
        };

        setRecognition(rec);
        recInstance = rec;
      }
    }

    return () => {
      if (recInstance) {
        try {
          recInstance.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleToggleListening = () => {
    if (!recognition) {
      setError("आपके इस ब्राउज़र में बोलकर लिखने की सुविधा काम नहीं कर रही है। कृपया क्रोम (Google Chrome) का इस्तेमाल करें।");
      return;
    }

    if (isListeningRef.current) {
      try {
        recognition.abort();
      } catch (err) {
        console.warn("Error aborting recognition:", err);
      }
      setIsListening(false);
      isListeningRef.current = false;
    } else {
      setError(null);
      originalTextRef.current = problemText;
      
      // Auto-configure to colloquial Hindi
      recognition.lang = "hi-IN";
      try {
        try {
          recognition.abort();
        } catch (e) {}
        
        setTimeout(() => {
          try {
            recognition.start();
            setIsListening(true);
            isListeningRef.current = true;
          } catch (err) {
            console.warn("Failed to resume mic:", err);
          }
        }, 50);
      } catch (err) {
        console.warn("Mic start failed:", err);
      }
    }
  };

  // Seek Guidance API Handler
  const handleSeekGuidance = async (customProblemText?: string) => {
    const textToQuery = customProblemText || problemText;
    if (!textToQuery.trim()) {
      setError("कृपया पहले डिब्बे में अपनी परेशानी लिखें या 'बोलकर बताएं' बटन दबाकर बोलें।");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const response = await fetch("/api/gita-guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          category,
          problem: textToQuery,
          language: "Colloquial Hindi (सरल हिन्दी)"
        })
      });

      if (!response.ok) {
        throw new Error("सर्वर से दिव्य सलाह प्राप्त करने में देरी हो रही है। कृपया एक बार फिर कोशिश करें।");
      }

      const data = (await response.json()) as GuidanceResult;
      setGuidance(data);
      setCurrentProblemForDisplay(textToQuery);
      
      // Increment and save advice count to persist free-tier status
      const newCount = adviceCount + 1;
      setAdviceCount(newCount);
      if (typeof window !== "undefined") {
        localStorage.setItem("gita_advice_count", String(newCount));
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "मार्गदर्शन प्राप्त करने में कुछ समस्या आई है। कृपया इंटरनेट कनेक्शन की जांच करें।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: typeof SUGGESTIONS[0]) => {
    setCategory(suggestion.category);
    setProblemText(suggestion.problem);
    handleSeekGuidance(suggestion.problem);
  };

  // TTS Voice Output setup
  useEffect(() => {
    const activeResult = guidance || INITIAL_DEMO_VERSE;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Create spoken script in simple spoken Hindi
      const textToSpeak = `
        भगवद गीता का श्लोक कहता है: ${activeResult.shlokaMeaning}.
        कृष्ण भगवान की सलाह है: ${activeResult.problemAnalysis}.
        पहला उपाय: ${activeResult.actionableGuidance[0] || ""}.
        दूसरा उपाय: ${activeResult.actionableGuidance[1] || ""}.
        तीसरा उपाय: ${activeResult.actionableGuidance[2] || ""}.
        याद रखें: ${activeResult.summaryNote}
      `;
      const speech = new SpeechSynthesisUtterance(textToSpeak);
      speech.lang = "hi-IN";
      speech.rate = 0.90;
      speech.pitch = 1.0;
      speech.onend = () => setIsPlaying(false);
      speech.onerror = () => setIsPlaying(false);
      setUtterance(speech);
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [guidance]);

  const toggleSpeech = () => {
    if (!window.speechSynthesis || !utterance) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf5] text-[#2c2c2c] flex flex-col font-sans selection:bg-amber-100">
      
      {/* Small Header */}
      <header className="bg-white border-b border-[#e8e2d2] px-4 py-3 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <AppLogo className="w-9 h-9" />
          <div>
            <h1 className="text-lg font-serif font-black text-[#5d4037] leading-tight">Gitawisdom</h1>
            <p className="text-[10px] text-stone-400 font-sans tracking-wide">गीता सरल मार्गदर्शन</p>
          </div>
        </div>

        {/* Global Toolbar Header items */}
        <button
          onClick={toggleSpeech}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
            isPlaying ? "bg-red-600 text-white border-red-600 animate-pulse" : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
          }`}
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlaying ? "रोकें (Stop)" : "🔊 पूरी बातचीत सुनें"}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-6">
        
        {/* Short, Simple Header Banner */}
        <div className="text-center space-y-2 py-2">
          <span className="text-[#e67e22] text-xs font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-wider inline-block">
            🙏 जय श्री कृष्ण 🙏
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-[#5d4037]">अपनी परेशानी सीधे श्री कृष्ण से पूछें</h2>
          <p className="text-stone-500 text-xs leading-relaxed max-w-md mx-auto">
            काम का तनाव हो, घर की अनबन या सेहत की चिंता, नीचे लिख दें या बटन दबाकर बोलें।
          </p>
        </div>

        {/* Dynamic loading state */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-6 border border-[#ede7d9] shadow-sm">
            <GitaLoader />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* PROBLEM INPUT PANEL */}
            {!guidance && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#ede7d9] space-y-5 animate-fade-in">
                  
                  {/* Free advice limit reached warning */}
                  {adviceCount >= 1 && (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-4 border border-amber-300 text-stone-800 flex gap-3 text-xs sm:text-sm items-center shadow-xs">
                      <Lock className="w-5 h-5 text-amber-700 shrink-0 animate-bounce" />
                      <div className="flex-1 font-semibold leading-relaxed">
                        आप पहले ही <strong>१ मुफ्त मार्गदर्शन</strong> प्राप्त कर चुके हैं। अब अगले सवालों के दिव्य उत्तर देखने के लिए नीचे दिए गए QR कोड से गुरु दक्षिणा दे सकते हैं या व्हाट्सएप पर स्क्रीनशॉट भेज सकते हैं।
                      </div>
                    </div>
                  )}
                
                {/* Visual Tip Container */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/50 p-3 rounded-2xl border border-amber-200/50">
                  <div className="text-xs text-amber-900 font-medium leading-relaxed">
                    👉 <strong>चलाने का आसान तरीका:</strong> डिब्बे में चिंता लिखें या पीले बटन को दबाकर बोलें!
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer shrink-0 ${
                      isListening
                        ? "bg-red-600 text-white border-red-600 animate-pulse shadow-md"
                        : "bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 animate-bounce" />
                        <span>⏸️ सुनना बंद करें</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>🎙️ यहाँ दबाकर परेशानी बोलें</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Main Problems Input box */}
                <div className="space-y-2">
                  <label htmlFor="problem-input" className="text-sm font-bold text-[#5d4037] block">
                    अपनी चिंता या समस्या यहाँ लिखें:
                  </label>
                  <textarea
                    id="problem-input"
                    rows={4}
                    placeholder="जैसे: 'मुझे काम की बहुत चिंता रहती है' या 'मुझे बहुत गुस्सा आता है' या जो भी मन में बात हो, बेझिझक यहाँ लिखें..."
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    className="w-full text-base p-4 rounded-xl border border-stone-200 bg-[#fbfbf9] text-stone-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all font-sans leading-relaxed"
                  />
                </div>

                {/* Suggestions row to keep it super simple */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-stone-400 block uppercase">
                    💡 या इनमें से किसी एक पर दबाकर देखें:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleApplySuggestion(sug)}
                        className="text-xs font-sans font-bold bg-[#faf9f5] hover:bg-amber-50/50 border border-stone-200/80 p-3 rounded-xl text-stone-700 transition-all cursor-pointer text-left flex items-start gap-2.5 active:scale-98"
                      >
                        <span className="text-amber-600 font-extrabold">🔸</span>
                        <div className="flex-1">
                          <span className="text-[#5d4037] block leading-tight">{sug.label}</span>
                          <span className="text-stone-400 font-normal text-[11px] line-clamp-1 block mt-0.5">{sug.problem}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 border-t border-stone-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProblemText("");
                      setError(null);
                    }}
                    className="px-4 py-3 border border-stone-200 text-stone-500 text-xs font-bold rounded-xl hover:bg-stone-50 cursor-pointer"
                  >
                    साफ करें
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeekGuidance()}
                    disabled={!problemText.trim()}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      problemText.trim()
                        ? "bg-[#e67e22] text-white hover:bg-[#cf6e1b]"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {adviceCount === 0 ? "Get first advice free" : "सलाह पाएँ (Get Advice)"}
                    </span>
                  </button>
                </div>

              </div>
              {adviceCount >= 1 && <PaymentBox />}
            </div>
          )}

            {/* RESULTS VIEW */}
            {guidance && (
              <div className="animate-fade-in space-y-4">
                <GuidanceDisplay
                  category={category}
                  guidance={guidance}
                  problemText={currentProblemForDisplay}
                  onNewSeek={() => {
                    setGuidance(null);
                    setProblemText("");
                    setCurrentProblemForDisplay("");
                  }}
                />
              </div>
            )}

          </div>
        )}

        {/* Global errors banner */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-800 rounded-2xl p-4 flex gap-3 text-xs items-center animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex-1 font-medium">{error}</div>
            <button
              onClick={() => setError(null)}
              className="font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-100 text-[10px]"
            >
              ठीक है
            </button>
          </div>
        )}

      </main>

      {/* Humble Footer */}
      <footer className="text-center h-12 flex items-center justify-center text-[11px] text-stone-400 font-serif border-t border-[#ede7d9]/60 max-w-2xl mx-auto w-full">
        जय श्री कृष्ण • Gitawisdom
      </footer>

    </div>
  );
}
