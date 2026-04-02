import { create } from 'zustand'
import { ofetch } from 'ofetch'
import type { AppData } from '../models/dataShape'
import type { LoadStatus } from '../models/loadStatus'

type AppDataStoreState = {
  data: AppData | null
  status: LoadStatus
  load: () => Promise<void>
  reset: () => void
}

export const useAppDataStore = create<AppDataStoreState>()((set) => ({
  data: null,
  status: 'blank',

  load: async () => {
    set({ status: 'loading' })

    const data = await ofetch<AppData>('/api/app-data')

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