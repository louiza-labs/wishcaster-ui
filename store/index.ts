// store.ts

import { createFooterSlice } from "@/store/footer"
import { createUserSlice } from "@/store/user"
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
// @ts-ignore
export const useBoundStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createFooterSlice(...a),
}))
