import 'isomorphic-fetch'
import { setupServer } from 'msw/node'
import { httpHandlers } from './handlers'

// This configures a Service Worker with the given request handlers.
export const server = setupServer(...httpHandlers)
