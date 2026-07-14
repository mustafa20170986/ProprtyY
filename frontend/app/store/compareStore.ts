import { create } from 'zustand';

type CompareStore = {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  ids: [],
  add: (id) => set((state) => ({ ids: state.ids.includes(id) ? state.ids : [...state.ids, id].slice(0,4) })),
  remove: (id) => set((state) => ({ ids: state.ids.filter(i => i!==id) })),
  clear: () => set({ ids: [] }),
}));
