export interface GuidanceResult {
  shlokaSanskrit: string;
  shlokaTransliterated: string;
  chapterAndVerse: string;
  shlokaMeaning: string;
  problemAnalysis: string;
  actionableGuidance: string[];
  summaryNote: string;
}

export interface HistoryItem {
  id: string;
  category: string;
  problem: string;
  language: string;
  timestamp: string;
  result: GuidanceResult;
}
