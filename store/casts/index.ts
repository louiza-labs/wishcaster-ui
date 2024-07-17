import { Cast as CastType } from "@/types"

export const createCastsSlice = (set: any) => ({
  casts: [],
  setCasts: (casts: CastType[]) => set(() => ({ casts: casts })),
})
