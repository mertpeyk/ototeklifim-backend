import type { FastifyInstance } from 'fastify';
import { getMarketComps, marketCompsQuerySchema } from '../lib/market-comps.js';

export async function marketCompsRoutes(app: FastifyInstance) {
  app.get('/market-comps', async (request) => {
    return getMarketComps(marketCompsQuerySchema.parse(request.query));
  });
}
