import type { FastifyInstance } from 'fastify';

import { prisma } from '../db.js';
import { vehicleCatalog } from '../data/vehicleCatalog.js';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/catalog/vehicles', async () => {
    const grouped = await prisma.listing.groupBy({
      by: ['category'],
      where: {
        status: 'ACTIVE',
      },
      _count: {
        _all: true,
      },
    });

    const countMap = new Map(
      grouped.map((item) => [item.category.toLowerCase(), item._count._all]),
    );

    return {
      ...vehicleCatalog,
      categories: vehicleCatalog.categories.map((category) => ({
        ...category,
        listingCount:
            countMap.get(category.label.toLowerCase()) ??
            countMap.get(category.key.toLowerCase()) ??
            0,
      })),
    };
  });
}
