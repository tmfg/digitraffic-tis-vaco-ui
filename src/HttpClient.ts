import axios from 'axios'

const TIS_ENVIRONMENT = import.meta.env.DEV // change this one we actually have env variables...
export const VACO_URL = TIS_ENVIRONMENT
  ? 'http://localhost:8080'
  : 'https://digitraffic-tis-dev.aws.fintraffic.cloud'

/*export const headers = {
  'Access-Control-Allow-Origin': '*'
}*/
export const getHeaders = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export const HttpClient = axios.create({
  baseURL: VACO_URL
})
