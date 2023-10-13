import axios, { AxiosInstance } from "axios";
import { Bootstrap } from "./types/Bootstrap.ts";

/*export const headers = {
  'Access-Control-Allow-Origin': '*'
}*/
export const getHeaders = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } }
}

let client:AxiosInstance;
export { client as HttpClient }

export function initializeHttpClient(bootstrap:Bootstrap) {
  client = axios.create({
    baseURL: bootstrap.environment === 'local' ? 'http://localhost:8080' : bootstrap.baseUrl
  })
}
