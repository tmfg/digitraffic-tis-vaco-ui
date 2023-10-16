import axios, { AxiosInstance } from 'axios'
import { Bootstrap } from './types/Bootstrap.ts'

export const getHeaders = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } }
}

let client: AxiosInstance
export { client as HttpClient }

export function initializeHttpClient(bootstrap: Bootstrap) {
  client = axios.create({
    baseURL: bootstrap.baseUrl
  })
}
