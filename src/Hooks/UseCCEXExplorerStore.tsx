import { createRef, RefObject } from 'react';
import { create } from 'zustand';

interface CCEXStoreState {
  showDerivatives: boolean;
  toggleShowDerivatives: () => void;
  appContainer: RefObject<HTMLDivElement | null>;
  modalIsVisible: boolean;
  setModelIsVisible: (v: boolean) => void;
}

export const useCCEXStore = create<CCEXStoreState>()((set) => ({
  showDerivatives: true,
  toggleShowDerivatives: () => set((state) => ({ showDerivatives: !state.showDerivatives })),
  appContainer: createRef<HTMLDivElement>(),
  modalIsVisible: false,
  setModelIsVisible: (v: boolean) => set({ modalIsVisible: v }),
}))