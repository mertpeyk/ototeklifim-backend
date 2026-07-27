import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import Fastify from 'fastify';

import { adminRoutes } from './routes/admin.js';
import { authRoutes } from './routes/auth.js';
import { auctionRoutes } from './routes/auctions.js';
import { catalogRoutes } from './routes/catalog.js';
import { consignmentRoutes } from './routes/consignments.js';
import { fastSaleRoutes } from './routes/fast-sales.js';
import { favoriteRoutes } from './routes/favorites.js';
import { healthRoutes } from './routes/health.js';
import { listingRoutes } from './routes/listings.js';
import { messageRoutes } from './routes/messages.js';
import { publicUploadRoutes, uploadRoutes } from './routes/uploads.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: true,
  });
  app.register(multipart);

  app.register(authRoutes, { prefix: '/api' });
  app.register(catalogRoutes, { prefix: '/api' });
  app.register(healthRoutes, { prefix: '/api' });
  app.register(listingRoutes, { prefix: '/api' });
  app.register(auctionRoutes, { prefix: '/api' });
  app.register(favoriteRoutes, { prefix: '/api' });
  app.register(messageRoutes, { prefix: '/api' });
  app.register(consignmentRoutes, { prefix: '/api' });
  app.register(fastSaleRoutes, { prefix: '/api' });
  app.register(uploadRoutes, { prefix: '/api' });
  app.register(publicUploadRoutes);
  app.register(adminRoutes, { prefix: '/api' });

  return app;
}
