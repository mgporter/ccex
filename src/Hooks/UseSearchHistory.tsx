import { useState } from "react";

export default function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  function addToHistory(chars: string): void {
    const historyWithItem = history.filter(x => x !== chars);
    setHistory([chars, ...historyWithItem]);
  }

  function removeMostRecent(): void {
    setHistory(history.slice(1));
  }

  return {
    history,
    addToHistory,
    removeMostRecent
  }

}