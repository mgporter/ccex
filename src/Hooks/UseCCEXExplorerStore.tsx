import { createRef, RefObject } from 'react';
import { create } from 'zustand';

interface CCEXStoreState {
  showDerivatives: boolean;
  toggleShowDerivatives: () => void;
  appContainer: RefObject<HTMLDivElement | null>;
}

export const useCCEXStore = create<CCEXStoreState>()((set) => ({
  showDerivatives: true,
  toggleShowDerivatives: () => set((state) => ({ showDerivatives: !state.showDerivatives })),
  appContainer: createRef<HTMLDivElement>(),
}))