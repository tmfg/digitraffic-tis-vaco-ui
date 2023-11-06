import axios, { AxiosInstance } from 'axios'
import { Bootstrap } from './types/Bootstrap.ts'

/* istanbul ignore next 10 -- @preserve */
export const getHeaders = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } }
}

let client: AxiosInstance
export { client as HttpClient }

/* istanbul ignore next 56 -- @preserve */
export function initializeHttpClient(bootstrap: Bootstrap) {
  client = axios.create({
    baseURL: bootstrap.baseUrl
  })
}
