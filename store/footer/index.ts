interface FooterVisibilityState {
  isFooterVisible: boolean
  setFooterVisible: (visible: boolean) => void
}

export const createFooterSlice = (set: any) => ({
  isFooterVisible: false,
  setFooterVisible: (visible: boolean) => set({ isFooterVisible: visible }),
})
