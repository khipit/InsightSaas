import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthenticatedRequest, NewsQuery, PaginatedResponse, ApiResponse } from '../types';
import { authenticateToken } from './auth';

const router = Router();
const prisma = new PrismaClient();

// Validation schema for query parameters
const newsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  category: z.string().optional(),
  source: z.string().optional(),
  companyId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
});

// Get latest news articles
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = newsQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message
      });
      return;
    }

    const { page, limit, category, source, companyId, startDate, endDate, search } = validation.data;

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (source) {
      where.source = source;
    }

    if (companyId) {
      where.companyIds = {
        has: companyId
      };
    }

    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const total = await prisma.news.count({ where });

    // Get paginated results
    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        url: true,
        source: true,
        author: true,
        publishedAt: true,
        category: true,
        tags: true,
        sentiment: true,
        companyIds: true,
        crawledAt: true
      }
    });

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<typeof news[0]> = {
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching news'
    });
  }
});

// Get single news article by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const article = await prisma.news.findUnique({
      where: { id }
    });

    if (!article) {
      res.status(404).json({
        success: false,
        error: 'News article not found'
      });
      return;
    }

    res.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching article'
    });
  }
});

// Get news sources
router.get('/meta/sources', async (req: Request, res: Response) => {
  try {
    const sources = await prisma.news.groupBy({
      by: ['source'],
      _count: {
        source: true
      },
      orderBy: {
        _count: {
          source: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: sources.map((s: any) => ({
        name: s.source,
        count: s._count.source
      }))
    });

  } catch (error) {
    console.error('Get sources error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching sources'
    });
  }
});

// Get news categories
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.news.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        category: {
          not: null
        }
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: categories.map((c: any) => ({
        name: c.category,
        count: c._count.category
      }))
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching categories'
    });
  }
});

// Get news for specific company (authenticated endpoint)
router.get('/company/:companyId', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const validation = newsQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message
      });
      return;
    }

    const { page, limit, startDate, endDate } = validation.data;

    const where: any = {
      companyIds: {
        has: companyId
      }
    };

    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) {
        where.publishedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.publishedAt.lte = new Date(endDate);
      }
    }

    const total = await prisma.news.count({ where });

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        url: true,
        source: true,
        author: true,
        publishedAt: true,
        category: true,
        tags: true,
        sentiment: true,
        crawledAt: true
      }
    });

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<typeof news[0]> = {
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Get company news error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching company news'
    });
  }
});

export default router;