import axios from 'axios'

export const VACO_URL = import.meta.env.DEV ? 'http://localhost:8080' : 'http://localhost:8080'

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
