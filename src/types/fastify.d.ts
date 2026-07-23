import type { AuthUser } from '../lib/auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
}
