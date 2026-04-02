import { create } from 'zustand'
import { ofetch } from 'ofetch'

type Profile = unknown

type ProfileState = {
  data: Profile | null
  load: () => Promise<void>
  reset: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  data: null,

  load: async () => {
    const data = await ofetch<Profile>('/api/profile')
    set({ data })
  },

  reset: () => {
    set({ data: null })
  },
}))