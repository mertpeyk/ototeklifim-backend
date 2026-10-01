import type { FastifyInstance } from 'fastify';

import { prisma } from '../db.js';
import { getVehicleCatalogSnapshot } from '../lib/vehicle-catalog-db.js';

export async function catalogRoutes(app: FastifyInstance) {
  app.get('/catalog/vehicles', async () => {
    const catalog = await getVehicleCatalogSnapshot();
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
      ...catalog,
      categories: ((catalog.categories as Array<{ label: string; key: string }>) || []).map((category) => ({
        ...category,
        listingCount:
            countMap.get(category.label.toLowerCase()) ??
            countMap.get(category.key.toLowerCase()) ??
            0,
      })),
    };
  });
}
