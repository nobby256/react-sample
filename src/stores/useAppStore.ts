import { create } from 'zustand'

type AppStoreState = {
  userName: string
  authorities: string[]
  initialized: boolean
  setAppInitialData: (data: { userName: string; authorities: string[] }) => void
  clearAppInitialData: () => void
}

export const useAppStore = create<AppStoreState>()((set) => ({
  userName: '',
  authorities: [],
  initialized: false,
  setAppInitialData: ({ userName, authorities }) =>
    set({
      userName,
      authorities,
      initialized: true,
    }),
  clearAppInitialData: () =>
    set({
      userName: '',
      authorities: [],
      initialized: false,
    }),
}))
