import React, { useState, useEffect } from "react";
import { GuidanceResult } from "../types";
import { Volume2, VolumeX, Copy, Download, Sparkles, BookOpen, Clock, AlertCircle } from "lucide-react";

interface GuidanceDisplayProps {
  guidance: GuidanceResult;
  problemText: string;
  category: "Career" | "Relationships" | "Health";
  onNewSeek: () => void;
}

export default function GuidanceDisplay({
  guidance,
  problemText,
  category,
  onNewSeek
}: GuidanceDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Setup TTS
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const textToSpeak = `
        From ${guidance.chapterAndVerse}. 
        The Shloka translated means: ${guidance.shlokaMeaning}.
        Guidance for your situation: ${guidance.problemAnalysis}.
        Step 1: ${guidance.actionableGuidance[0] || ""}.
        Step 2: ${guidance.actionableGuidance[1] || ""}.
        Step 3: ${guidance.actionableGuidance[2] || ""}.
        Remember: ${guidance.summaryNote}
      `;
      const speech = new SpeechSynthesisUtterance(textToSpeak);
      speech.rate = 0.95; // Slightly slower, more soothing pace
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
    if (!window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (utterance) {
      window.speechSynthesis.cancel(); // Clear any existing speech
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleCopy = () => {
    const formattedText = `
Bhagavad Gitawisdom - ${guidance.chapterAndVerse}
==================================================
Topic: ${category}
Your Problem: "${problemText}"

[Shloka (Sanskrit)]
${guidance.shlokaSanskrit}

[Transliteration]
${guidance.shlokaTransliterated}

[Literal English Translation]
${guidance.shlokaMeaning}

[Timeless Solution & Analysis]
${guidance.problemAnalysis}

[Practical Actionable Guidelines]
1. ${guidance.actionableGuidance[0]}
2. ${guidance.actionableGuidance[1]}
3. ${guidance.actionableGuidance[2]}

[Encouraging Words]
${guidance.summaryNote}

Derived with love from Bhagavad Gitawisdom app.
    `;
    navigator.clipboard.writeText(formattedText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const formattedText = `
Bhagavad Gitawisdom
===========================
Topic: ${category}
Date Gathered: ${new Date().toLocaleDateString()}

User Concern:
"${problemText}"

---------------------------------------------------
SACRED REVELATION: ${guidance.chapterAndVerse}
---------------------------------------------------
Sanskrit Verse:
${guidance.shlokaSanskrit}

Phonetic Transliteration:
${guidance.shlokaTransliterated}

Scriptural Translation:
${guidance.shlokaMeaning}

---------------------------------------------------
INTEGRATED SOUL SOLUTION & COUNSEL
---------------------------------------------------
${guidance.problemAnalysis}

TIMELINE OF ACTIONS:
1. ${guidance.actionableGuidance[0]}
2. ${guidance.actionableGuidance[1]}
3. ${guidance.actionableGuidance[2]}

DIVINE TRUTH:
"${guidance.summaryNote}"

===========================
Blessed Be Your Spiritual Walk.
    `;
    const element = document.createElement("a");
    const file = new Blob([formattedText.trim()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Gitawisdom_${category}_${guidance.chapterAndVerse.replace(/[\s,]+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper colors for Categories
  const themeColors = {
    Career: {
      light: "bg-emerald-50/50 border-emerald-100",
      accent: "text-emerald-700 bg-emerald-100/60",
      border: "border-emerald-200/50"
    },
    Relationships: {
      light: "bg-rose-50/50 border-rose-100",
      accent: "text-rose-700 bg-rose-100/60",
      border: "border-rose-200/50"
    },
    Health: {
      light: "bg-purple-50/50 border-purple-100",
      accent: "text-purple-700 bg-purple-100/60",
      border: "border-purple-200/50"
    }
  };

  const categories = {
    Career: "काम और करियर (Work)",
    Relationships: "रिश्ते और परिवार (Relations)",
    Health: "स्वास्थ्य और सेहत (Health)"
  };

  return (
    <div className="space-y-8 animate-fade-in" id="guidance-results-panel">
      {/* Overview Tag & Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs text-stone-500 uppercase tracking-widest font-mono font-bold">मदद की केटेगरी</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium font-sans ${themeColors[category].accent}`}>
              {categories[category] || "गीता दर्शन"}
            </span>
            <span className="text-xs text-stone-400 font-serif">सलाह केंद्र</span>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex items-center gap-2">
          {/* TTS Button */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold font-sans transition-all cursor-pointer ${
              isPlaying
                ? "bg-red-600 text-white border-red-600 animate-pulse"
                : "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
            }`}
            title="Read results aloud"
            id="btn-tts"
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-3.5 h-3.5" /> 🛑 आवाज़ बंद करें
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" /> 🔊 आवाज़ सुनें (बोलकर सुनें)
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 bg-white font-semibold font-sans hover:bg-stone-50 transition-all cursor-pointer"
            title="Copy guidance details"
            id="btn-copy"
          >
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            {copied ? "कॉपी हो गया!" : "📋 कॉपी करें"}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 bg-white font-semibold font-sans hover:bg-stone-50 transition-all cursor-pointer"
            title="Download text file"
            id="btn-download"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" /> 📥 फ़ोन में सेव करें
          </button>
        </div>
      </div>

      {/* Scripture Scroll Card Design */}
      <div className="bg-[#fffdf8] border-2 border-[#e8dfc7] shadow-lg rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Divine Background Motif Lines */}
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
          <svg width="220" height="220" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Header - Reference Indicator */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 text-amber-700">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#b5952d]">
              गीता का दिव्य श्लोक
            </span>
          </div>
          <span className="bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xs">
            {guidance.chapterAndVerse}
          </span>
        </div>

        {/* Sanskrit shloka (Devanagari script) */}
        <div className="text-center font-serif text-amber-950 font-bold tracking-wide leading-loose text-lg sm:text-xl py-4 px-2 bg-gradient-to-r from-amber-50/80 via-amber-50 to-amber-50/80 rounded-xl border border-amber-100/60 my-4 shadow-inner relative">
          <div className="absolute left-2 top-2 text-amber-200 font-serif text-3xl select-none">“</div>
          <div className="absolute right-2 bottom-2 text-amber-200 font-serif text-3xl select-none">”</div>
          <p className="whitespace-pre-line text-[#902919] font-bold tracking-widest">{guidance.shlokaSanskrit}</p>
        </div>

        {/* Phonetic Transliteration */}
        <div className="text-center italic text-stone-500 font-medium text-xs sm:text-sm font-sans py-1 px-4 leading-relaxed max-w-xl mx-auto mb-6">
          {guidance.shlokaTransliterated}
        </div>

        {/* Shloka Meaning Card */}
        <div className="border-t border-b border-amber-100 py-5 my-6 space-y-2">
          <h4 className="text-stone-400 uppercase tracking-wider font-mono text-xs text-center font-bold">
            सरल हिंदी में इसका अर्थ:
          </h4>
          <p className="text-[#5d4037] text-center font-serif text-base sm:text-lg leading-relaxed font-bold max-w-2xl mx-auto">
            "{guidance.shlokaMeaning}"
          </p>
        </div>

        {/* Personalization Mixture Segment */}
        <div className="space-y-3 mt-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif font-black text-[#5d4037] text-base sm:text-lg">
              आपकी परेशानी पर भगवान कृष्ण की सलाह:
            </h3>
          </div>
          <div className="bg-amber-100/30 rounded-xl p-5 border border-amber-200/50 shadow-xs">
            <p className="text-stone-800 font-sans text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
              {guidance.problemAnalysis}
            </p>
          </div>
        </div>

        {/* Actionable Path segment */}
        <div className="mt-8 space-y-4">
          <h4 className="font-serif font-black text-[#5d4037] text-sm sm:text-base tracking-wide border-b border-stone-200 pb-2">
            निदान: आपके लिए ३ आसान उपाय (सरल क़दम):
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guidance.actionableGuidance.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-mono text-sm font-black mb-3 shrink-0 shadow-sm shadow-amber-500/20">
                    {idx + 1}
                  </span>
                  <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-bold">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Divine Truth banner */}
        <div className="mt-8 border-t border-dashed border-amber-200 pt-6 text-center">
          <div className="w-2.5 h-2.5 bg-amber-600 rounded-full mx-auto mb-3 animate-ping" style={{ animationDuration: "3s" }}></div>
          <p className="font-serif italic text-amber-950 font-bold text-sm sm:text-base max-w-lg mx-auto">
            "{guidance.summaryNote}"
          </p>
        </div>
      </div>

      {/* Applet Secondary Actions */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onNewSeek}
          className="bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
          id="btn-seek-again"
        >
          🔄 कोई दूसरी परेशानी पूछें (Ask another worry)
        </button>
      </div>
    </div>
  );
}
