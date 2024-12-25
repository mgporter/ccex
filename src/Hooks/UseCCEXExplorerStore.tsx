import { create } from 'zustand';

interface CCEXStoreState {
  showDerivatives: boolean;
  toggleShowDerivatives: () => void;
}

export const useCCEXStore = create<CCEXStoreState>()((set) => ({
  showDerivatives: true,
  toggleShowDerivatives: () => set((state) => ({ showDerivatives: !state.showDerivatives }))
}))