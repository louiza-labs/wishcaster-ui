// store.ts
import { create } from "zustand"

interface FooterVisibilityState {
  isFooterVisible: boolean
  setFooterVisible: (visible: boolean) => void
}

export const useFooterVisibilityStore = create<FooterVisibilityState>(
  (set) => ({
    isFooterVisible: false,
    setFooterVisible: (visible: boolean) => set({ isFooterVisible: visible }),
  })
)
