import React, { useState, useEffect, useRef } from "react";
import { Compass, Sparkles, RefreshCw, Briefcase, Heart, Shield, Landmark, HelpCircle, History, BookOpen, AlertCircle, Volume2, VolumeX, Copy, Download, Trash2, ListFilter, Globe2, Mic, MicOff } from "lucide-react";
import GitaLoader from "./components/GitaLoader";
import { GuidanceResult, HistoryItem } from "./types";

const SUGGESTIONS = [
  {
    category: "General",
    label: "Workload & Anxiety",
    problem: "I am feeling extremely stuck in my career. Even though I work hard, I am constantly worried about promotions, failure, and what others think of my progress. It is making me anxious and losing focus on daily tasks."
  },
  {
    category: "General",
    label: "Expectations & Resentment",
    problem: "I have deep expectations from my close partner, but they don't seem to care. Every conversation turns into structural conflict. I want to clear this resentment and find emotional harmony."
  },
  {
    category: "General",
    label: "Chronic Pain & Fear",
    problem: "I have been dealing with persistent physical fatigue and health challenges. It's draining me mentally and making me fearful of what the future holds. How do I cultivate fortitude and peace?"
  }
];

// Default "Verse of the Day" placeholder for the Bento cells before the first custom query is run
const INITIAL_DEMO_VERSE: GuidanceResult = {
  shlokaSanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
  shlokaTransliterated: "karmaṇy-evādhikāras te mā phaleṣu kadācana ।\nmā karma-phala-hetur bhūr mā te saṅgo ’stv akarmaṇi ॥",
  chapterAndVerse: "Chapter 2, Verse 47",
  shlokaMeaning: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
  problemAnalysis: "This eternal advice is Sri Krishna's ultimate remedy for anxiety. Your stress is caused by living in the future results (the fruit) rather than the present moment (the action). By releasing psychological ownership over what happens next, you reclaim absolute focusing power over what you must do right now.",
  actionableGuidance: [
    "Identify the single most critical task in front of you today. Dedicate your full energy to doing it with complete craftsmanship without thinking of speed or reward.",
    "When fear of outcome or opinion of others starts arising, label it silent as 'Fruit Projection' and intentionally return your breath and hands to the active work.",
    "Understand that action itself is your playground, while the outcome is governed by a complex web of external factors. Treat the result as a gift, whatever shape it takes."
  ],
  summaryNote: "Perform your acts of duty with equanimity, O Arjuna, abandoning all dependency on the fruits of success or failure."
};

export default function App() {
  const [category, setCategory] = useState<string>("General");
  const [problemText, setProblemText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceResult | null>(null);
  const [currentProblemForDisplay, setCurrentProblemForDisplay] = useState<string>("");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Voice Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const isListeningRef = useRef(false);
  const originalTextRef = useRef("");

  // Stats
  const [versesExplored, setVersesExplored] = useState(5);

  // Speech feedback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Setup Web Speech API Speech Recognition
  useEffect(() => {
    let recInstance: any = null;
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
            console.log("Speech recognition aborted normally.");
          } else {
            console.warn("Speech Recognition info/error:", event.error || event);
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
      setError("Speech recognition is not fully supported in this browser environment. Please consider using Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListeningRef.current) {
      try {
        recognition.abort();
      } catch (err) {
        console.warn("Error aborting speech recognition:", err);
      }
      setIsListening(false);
      isListeningRef.current = false;
    } else {
      setError(null);
      // Store current text box value so spoken text can be appended to it
      originalTextRef.current = problemText;
      
      let langCode = "en-US";
      const langLower = selectedLanguage.toLowerCase();
      if (langLower.includes("hindi")) langCode = "hi-IN";
      else if (langLower.includes("sanskrit")) langCode = "sa-IN";
      else if (langLower.includes("spanish")) langCode = "es-ES";
      else if (langLower.includes("french")) langCode = "fr-FR";
      else if (langLower.includes("german")) langCode = "de-DE";
      else if (langLower.includes("gujarati")) langCode = "gu-IN";
      else if (langLower.includes("bengali")) langCode = "bn-IN";
      else if (langLower.includes("telugu")) langCode = "te-IN";
      else if (langLower.includes("tamil")) langCode = "ta-IN";
      else if (langLower.includes("marathi")) langCode = "mr-IN";
      else if (langLower.includes("kannada")) langCode = "kn-IN";
      
      recognition.lang = langCode;
      try {
        // Stop or abort in case any lingering voice session is running
        try {
          recognition.abort();
        } catch (e) {}
        
        // Wait briefly (50ms) to allow recognition engine transition state cleanly
        setTimeout(() => {
          try {
            recognition.start();
            setIsListening(true);
            isListeningRef.current = true;
          } catch (err: any) {
            if (err.message && err.message.includes("already started")) {
              console.log("Speech recognition is already running safely.");
            } else {
              console.warn("Failed to start speech recognition in delayed execution:", err);
            }
          }
        }, 50);
      } catch (err: any) {
        console.warn("Failed to start speech recognition:", err);
      }
    }
  };

  // Load history & initial states
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("gita_guidance_history");
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory) as HistoryItem[];
        setHistoryList(parsed);
        // Spiritual progress corresponds to actual explored history + base set
        setVersesExplored(5 + parsed.length);
      }
    } catch (e) {
      console.error("Failed to load history from standard storage", e);
    }
  }, []);

  // Update TTS on guidance change
  useEffect(() => {
    const activeResult = guidance || INITIAL_DEMO_VERSE;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const textToSpeak = `
        From ${activeResult.chapterAndVerse}. 
        The Shloka translated means: ${activeResult.shlokaMeaning}.
        Krishna's guidance: ${activeResult.problemAnalysis}.
        Step 1: ${activeResult.actionableGuidance[0] || ""}.
        Step 2: ${activeResult.actionableGuidance[1] || ""}.
        Step 3: ${activeResult.actionableGuidance[2] || ""}.
        Remember: ${activeResult.summaryNote}
      `;
      const speech = new SpeechSynthesisUtterance(textToSpeak);
      speech.rate = 0.95;
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
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleCopy = () => {
    const activeResult = guidance || INITIAL_DEMO_VERSE;
    const activeProblem = currentProblemForDisplay || "The eternal human condition of performance and attachment.";
    const activeCategory = guidance ? category : "Eternal Path";

    const formattedText = `
Bhagavad Gita Guidance - ${activeResult.chapterAndVerse}
==================================================
Topic: ${activeCategory}
Problem Statement: "${activeProblem}"

[Shloka (Sanskrit)]
${activeResult.shlokaSanskrit}

[Transliteration]
${activeResult.shlokaTransliterated}

[Literal Translation]
${activeResult.shlokaMeaning}

[Soul Guidance Analysis]
${activeResult.problemAnalysis}

[Three Action Steps]
1. ${activeResult.actionableGuidance[0]}
2. ${activeResult.actionableGuidance[1]}
3. ${activeResult.actionableGuidance[2]}

[Encouraging Words]
"${activeResult.summaryNote}"

Created with GitaMarg - The Path of Wisdom.
    `;
    navigator.clipboard.writeText(formattedText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const activeResult = guidance || INITIAL_DEMO_VERSE;
    const activeProblem = currentProblemForDisplay || "The eternal human condition of performance and attachment.";
    const activeCategory = guidance ? category : "Eternal Path";

    const formattedText = `
Bhagavad Gita Guidance Journal Entry
=====================================
Category: ${activeCategory}
Date: ${new Date().toLocaleDateString()}

Concern shared:
"${activeProblem}"

----------------------------------------
SACRED VERSE: ${activeResult.chapterAndVerse}
----------------------------------------
Sanskrit Original:
${activeResult.shlokaSanskrit}

Transliteration:
${activeResult.shlokaTransliterated}

English Translation:
${activeResult.shlokaMeaning}

----------------------------------------
TEMPLE SYNTHESIS & PRACTICAL PATHWAY
----------------------------------------
${activeResult.problemAnalysis}

Sadhana Actions:
1. ${activeResult.actionableGuidance[0]}
2. ${activeResult.actionableGuidance[1]}
3. ${activeResult.actionableGuidance[2]}

Daily Meditation Note:
"${activeResult.summaryNote}"
    `;
    const element = document.createElement("a");
    const file = new Blob([formattedText.trim()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Gita_Guidance_${activeCategory}_${activeResult.chapterAndVerse.replace(/[\s,]+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Seek Guidance API Execution
  const handleSeekGuidance = async (customProblemText?: string) => {
    const textToQuery = customProblemText || problemText;
    if (!textToQuery.trim()) {
      setError("Please describe your situation or select a quick query suggestion template below.");
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
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as GuidanceResult;

      setGuidance(data);
      setCurrentProblemForDisplay(textToQuery);

      // Save to local journal history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        category,
        problem: textToQuery,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        result: data
      };

      const updatedHistory = [newHistoryItem, ...historyList];
      setHistoryList(updatedHistory);
      localStorage.setItem("gita_guidance_history", JSON.stringify(updatedHistory));
      setVersesExplored(5 + updatedHistory.length);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to reach the sacred guidance API. Please check internet connections or secret key configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Action: Select suggestion template
  const handleApplySuggestion = (suggestion: typeof SUGGESTIONS[0]) => {
    setCategory(suggestion.category);
    setProblemText(suggestion.problem);
    // Auto-run for flawless UX
    handleSeekGuidance(suggestion.problem);
  };

  // History Actions
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCategory(item.category);
    setProblemText(item.problem);
    setCurrentProblemForDisplay(item.problem);
    setGuidance(item.result);
    setError(null);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById("main-bento-anchor")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem("gita_guidance_history", JSON.stringify(updated));
    setVersesExplored(5 + updated.length);
  };

  const handleClearAllHistory = () => {
    setHistoryList([]);
    localStorage.removeItem("gita_guidance_history");
    setVersesExplored(5);
  };

  // Pick display variables
  const activeResult = guidance || INITIAL_DEMO_VERSE;
  const isDisplayingCustom = !!guidance;

  // Aesthetic colors matching category
  const borderHighlightClass = "border-amber-200 focus:ring-amber-500";

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#2c2c2c] flex flex-col font-sans transition-colors duration-500 selection:bg-amber-200">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e2d2] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e67e22] rounded-full flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#5d4037] flex items-center gap-2">
              GitaMarg
              <span className="font-sans text-xs font-semibold bg-amber-100 text-[#e67e22] px-2 py-0.5 rounded-md uppercase tracking-wider">
                V4 Bento
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-stone-400 font-sans italic tracking-wide">Timeless Vedic Counselor for Modern Struggles</p>
          </div>
        </div>

        {/* Global Toolbar Header items */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Audio read-aloud controller */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isPlaying
                ? "bg-amber-600 text-white border-amber-600 animate-pulse"
                : "bg-stone-50 text-stone-700 border-[#e8e2d2] hover:bg-stone-100"
            }`}
            title="Read current guidance aloud"
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden hidden-xs sm:inline">{isPlaying ? "Mute Verse" : "Listen Audio"}</span>
          </button>

          {/* Quick Clear Action */}
          {guidance && (
            <button
              onClick={() => {
                setGuidance(null);
                setProblemText("");
                setCurrentProblemForDisplay("");
                setError(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-[#5d4037] text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Header bar */}
      <div className="bg-[#fcfaf5] border-b border-[#ebdcb9]/40 py-8 px-4 sm:px-8 text-center max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[#e67e22] font-mono text-xs font-bold tracking-widest uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
            Sacred Counselor System
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-black text-[#5d4037] tracking-tight">
            Consult the Bhagavad Gita for your Life Conflicts
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            Enter a personal challenge regarding work stress, heavy relations, or chronic health struggles. We search and extract the exact divine shloka and formulate a customized path integrating transcendental Sanskrit wisdom into your active circumstance.
          </p>
        </div>
      </div>

      {/* Main Content Area: Responsive Bento Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8" id="main-bento-anchor">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex gap-3 text-sm items-center animate-shake" id="error-alert">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Divine Guidance Interrupted</p>
              <p className="text-xs text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="text-xs font-bold text-red-900 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-100 transition-all"
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-3xl p-8 border border-[#ede7d9] shadow-sm">
            <GitaLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative justify-center">
            
            {/* 1. INPUT BENTO CELL */}
            <div className={`md:col-span-12 ${guidance ? "lg:col-span-5" : "lg:col-span-8 lg:col-start-2 xl:col-span-6 xl:col-start-4"} bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#ede7d9] flex flex-col justify-between space-y-6 transition-all duration-500`}>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#fef5e7] text-[#e67e22] text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border border-amber-100">
                    Current Inquiry Focus
                  </span>
                  <div className="flex items-center gap-1.5 text-stone-400 text-xs">
                    <Globe2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Response:</span>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="text-xs font-bold text-[#e67e22] bg-stone-50 border border-stone-200 rounded-md p-1 focus:outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Hindi Text with Translation">Hindi (हिन्दी)</option>
                      <option value="Sanskrit with Translation">Sanskrit (संस्कृतम्)</option>
                      <option value="Spanish translation">Spanish (Español)</option>
                      <option value="French translation">French (Français)</option>
                      <option value="German translation">German (Deutsch)</option>
                      <option value="Gujarati translation">Gujarati (ગુજરાતી)</option>
                      <option value="Bengali translation text">Bengali (বাংলা)</option>
                      <option value="Telugu translation">Telugu (తెలుగు)</option>
                      <option value="Tamil translation">Tamil (தமிழ்)</option>
                      <option value="Marathi translation">Marathi (मराठी)</option>
                      <option value="Kannada translation">Kannada (ಕನ್ನಡ)</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-black text-[#5d4037] leading-tight">
                  Share your active journey obstacle.
                </h3>

                {/* Conflict Narrative input area */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono font-bold text-stone-400 uppercase tracking-widest block" htmlFor="problem-input">
                      Narrative of your Trouble
                    </label>
                    <button
                      type="button"
                      onClick={handleToggleListening}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isListening
                          ? "bg-red-50 text-red-600 border-red-200 animate-pulse shadow-sm shadow-red-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                      }`}
                      title={isListening ? "Stop voice listening" : "Speak your problem"}
                    >
                      {isListening ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                          <MicOff className="w-3.5 h-3.5 text-red-600" />
                          <span>Listening...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-amber-600" />
                          <span>Speak Problem</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    id="problem-input"
                    rows={4}
                    placeholder="Describe your concern in detail (e.g. share whatever is causing you pain, stress, decision difficulties, career issues, relationship troubles, or physical anxiety)..."
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    className={`w-full text-sm p-4 rounded-2xl border bg-[#faf9f6] text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-sans leading-relaxed ${borderHighlightClass}`}
                  />
                </div>
              </div>

              {/* Suggestions template row */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block">
                  Quick Query Templates / Try immediate:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySuggestion(sug)}
                      className="text-[11px] font-sans font-medium bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 px-2.5 py-1 rounded-lg text-stone-600 transition-all cursor-pointer text-left line-clamp-1"
                    >
                      {sug.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions segment */}
              <div className="pt-4 border-t border-[#ede7d9] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setProblemText("")}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-xs font-bold hover:bg-stone-50 cursor-pointer transition-all"
                >
                  Clear Fields
                </button>
                <button
                  type="button"
                  onClick={() => handleSeekGuidance()}
                  disabled={!problemText.trim()}
                  className={`px-6 py-2.5 rounded-xl font-bold font-sans text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    problemText.trim()
                      ? "bg-[#e67e22] text-white hover:bg-[#cf6e1b] shadow-amber-500/10 active:scale-95"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                  }`}
                  id="btn-seek-guidance"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Seek Gita's Counsel
                </button>
              </div>
            </div>

            {/* MAIN RESULTS BENTO STRUCTURE (Column Span 7) */}
            {guidance && (
              <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in duration-500">

                {/* 2. THE SACRED SHLOKA CARD (Column Span 12, Row Span 2 in design) */}
                <div className="md:col-span-12 bg-[#2c3e50] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md flex flex-col justify-between border border-[#1a252f]">
                  {/* Background Motif watermark */}
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-8 translate-y-8">
                    <svg width="220" height="220" viewBox="0 0 100 100" fill="white">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                      <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-[#f39c12] rounded-full animate-ping"></div>
                      <span className="text-[#f39c12] font-mono text-xs font-bold tracking-widest uppercase">
                        Divine Response Location
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono font-black uppercase text-amber-300">
                      {activeResult.chapterAndVerse}
                    </span>
                  </div>

                  <div className="space-y-5 text-center">
                    <p className="text-xl sm:text-2xl font-serif text-[#fdf5e6] font-bold leading-loose tracking-wide whitespace-pre-line py-2">
                      {activeResult.shlokaSanskrit}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-300 italic font-medium leading-relaxed max-w-xl mx-auto font-serif">
                      {activeResult.shlokaTransliterated}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2 justify-end">
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:text-white hover:bg-white/15 cursor-pointer text-xs flex items-center gap-1"
                      title="Copy Sanskrit Verse Text"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-1.5 rounded-lg bg-white/5 text-white/80 hover:text-white hover:bg-white/15 cursor-pointer text-xs flex items-center gap-1"
                      title="Save current file details"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* 3. THE LITERAL TRANSLATION CARD (Column Span 5) */}
                <div className="md:col-span-5 bg-[#fdf5e6] rounded-3xl p-6 border-2 border-[#f39c12]/20 flex flex-col justify-between shadow-xs">
                  <div>
                    <h4 className="text-[#d35400] text-xs font-bold uppercase tracking-widest mb-4 font-mono flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#d35400]" />
                      The Literal Meaning
                    </h4>
                    <p className="text-[#5d4037] font-serif text-sm sm:text-base leading-relaxed italic">
                      "{activeResult.shlokaMeaning}"
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#f39c12]/10">
                    <div className="flex items-center gap-2 text-[#d35400] font-black text-[10px] tracking-widest uppercase">
                      <div className="w-2 h-2 bg-[#d35400] rounded-full"></div>
                      Dharma Standard: Nishkama Karma
                    </div>
                  </div>
                </div>

                {/* 4. THE SYNTHESIS AND SOUL SOLUTION CARD (Column Span 7) */}
                <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-[#ede7d9] flex flex-col justify-between shadow-xs space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[#27ae60] text-xs font-black uppercase tracking-widest font-mono flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Counsel & Pathway
                      </h4>
                      {isDisplayingCustom ? (
                        <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide border border-green-100">
                          Tailored Response
                        </span>
                      ) : (
                        <span className="text-[10px] bg-stone-50 text-stone-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide border border-stone-200">
                          Default Insight
                        </span>
                      )}
                    </div>

                    <div className="space-y-3.5">
                      {/* Synthesis mixture text */}
                      <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">Sri Krishna's Synthesis</p>
                        <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans font-medium whitespace-pre-line">
                          {activeResult.problemAnalysis}
                        </p>
                      </div>

                      {/* Highly practical guidelines mapping */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block">Actionable Sadhana Steps</p>
                        <div className="space-y-1.5">
                          {activeResult.actionableGuidance.map((step, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-xs text-stone-700">
                              <span className="w-4 h-4 rounded-full bg-[#b5952d] text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed font-medium">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3">
                    <p className="text-[10px] text-stone-400 font-mono italic">
                      Divine Advice Note: "{activeResult.summaryNote}"
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Bento Layout Footer */}
      <footer className="mt-auto py-6 bg-white border-t border-[#e8e2d2] flex flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Guided by Ancient Wisdom • Rendered for Modern Pathfinders</p>
        <p className="text-[9px] text-[#e67e22] font-mono font-bold">BHAGAVAD GITA LIFE COMPASS v4 • POWERED BY GEMINI 3.5 FLASH</p>
      </footer>

    </div>
  );
}
