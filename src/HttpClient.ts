import axios from 'axios'

const TIS_ENVIRONMENT = import.meta.env.DEV // change this one we actually have env variables...
export const VACO_URL = TIS_ENVIRONMENT ? 'http://localhost:8080' : 'http://localhost:8080'

export const HttpClient = axios.create({
  baseURL: VACO_URL,
  headers: {
    post: {
      'Access-Control-Allow-Origin': '*'
    },
    get: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
