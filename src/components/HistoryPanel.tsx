import React, { useState } from "react";
import { HistoryItem } from "../types";
import { Trash2, Calendar, Search, ExternalLink, Bookmark, ShieldAlert, Heart, Briefcase, HelpCircle } from "lucide-react";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onClearAll
}: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.problem.toLowerCase().includes(term) ||
      item.result.chapterAndVerse.toLowerCase().includes(term) ||
      item.result.shlokaMeaning.toLowerCase().includes(term)
    );
  });



  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 mt-8 space-y-4 shadow-sm" id="saved-guidance-history">
      {/* Title block */}
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#b5952d]" />
          <h3 className="font-semibold text-stone-850 text-base font-sans">
            Your Spiritual Journal ({history.length})
          </h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your entire spiritual journal?")) {
                onClearAll();
              }
            }}
            className="text-xs text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
            id="btn-clear-history"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Journal
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-stone-400 font-sans text-sm space-y-2">
          <HelpCircle className="w-8 h-8 mx-auto text-stone-300" />
          <p>Your previous questions and guidance will appear here.</p>
          <p className="text-xs text-stone-400">Ask your first question above to begin your spiritual log.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Search container */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search past problems or shlokas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-sans"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2.5">
            {filteredHistory.length === 0 ? (
              <p className="text-center py-4 text-xs text-stone-400 font-sans">No matching entries found.</p>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-stone-50/70 border border-stone-200/50 rounded-xl hover:border-amber-300 hover:bg-[#fffdfb] transition-all flex justify-between gap-3 group relative cursor-pointer"
                  onClick={() => onSelect(item)}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Badge and Time */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold border flex items-center gap-1 bg-amber-50/50 text-amber-800 border-amber-100/60">
                        <Bookmark className="w-3 h-3 text-amber-600" />
                        Inquiry Log
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono border border-stone-200 bg-stone-100 text-stone-500">
                        {item.language || "English"}
                      </span>
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    {/* Problem summary */}
                    <p className="text-stone-700 text-xs font-semibold font-sans line-clamp-1">
                      "{item.problem}"
                    </p>

                    {/* Selected Shloka Reference */}
                    <p className="text-[11px] text-stone-500 font-serif italic">
                      Granted verse: <span className="font-semibold text-amber-800">{item.result.chapterAndVerse}</span> - "{item.result.shlokaMeaning.slice(0, 50)}..."
                    </p>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item);
                      }}
                      className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded"
                      title="Recall guidance details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
