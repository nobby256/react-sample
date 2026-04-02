import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
})