import { useSyncExternalStore } from "react";

type State = {
  activeRunId: string | null;
  /** claimId -> human review decision */
  reviews: Record<string, "critic" | "redteam" | "more-evidence">;
};

let state: State = { activeRunId: null, reviews: {} };
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function setActiveRun(runId: string | null) {
  state.activeRunId = runId;
  emit();
}

export function recordReview(claimId: string, choice: State["reviews"][string]) {
  state.reviews = { ...state.reviews, [claimId]: choice };
  emit();
}

export function useRunStatus() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
}
