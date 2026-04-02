import { create } from 'zustand'
import { ofetch } from 'ofetch'
import type { ProfileData } from '../models/dataShape'
import type { LoadStatus } from '../models/loadStatus'

type ProfileStoreState = {
  data: ProfileData | null
  status: LoadStatus
  load: () => Promise<void>
  reset: () => void
}

export const useProfileStore = create<ProfileStoreState>()((set) => ({
  data: null,
  status: 'blank',
  error: null,

  load: async () => {
    set({ status: 'loading' })

    const data = await ofetch<ProfileData>('/api/profile')

    set({
      data,
      status: 'success',
    })
  },

  reset: () => {
    set({
      data: null,
      status: 'blank',
    })
  },
}))