import express, { Request, Response } from 'express';
import {
  createMediaSchema,
  updateMediaSchema,
  paginationSchema,
  mediaIdSchema,
} from '../schemas/mediaSchemas';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import type {
  ApiResponse,
  PaginatedResponse,
  Media,
  MediaStats,
  CreateMediaInput,
  UpdateMediaInput
} from '../types/media';
import '../types/express'; // Import to register the Request extension

const router = express.Router();

// GET /api/media - Get all media with pagination and filtering
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Validate query parameters
    const queryParams = paginationSchema.parse(req.query);
    const { page, limit, search, type, genre, year, sortBy, sortOrder } =
      queryParams;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build filter conditions
    const whereConditions: any = {};

    if (search) {
      // SQLite doesn't support mode: 'insensitive' in Prisma
      // Using simple contains for now - this will be case-sensitive
      // For proper case-insensitive search in SQLite, we'd need raw SQL
      whereConditions.OR = [
        { title: { contains: search } },
        { director: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (type) {
      whereConditions.type = type;
    }

    if (genre) {
      whereConditions.genre = genre;
    }

    if (year) {
      whereConditions.year = year;
    }

    // Build sort conditions
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    // Execute queries
    const [media, totalCount] = await Promise.all([
      req.prisma.media.findMany({
        where: whereConditions,
        orderBy,
        skip,
        take: limit,
      }),
      req.prisma.media.count({
        where: whereConditions,
      }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const response: ApiResponse<PaginatedResponse<Media>> = {
      success: true,
      data: {
        data: media,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPreviousPage,
          limit,
        },
      },
    };

    res.json(response);
  })
);

// GET /api/media/:id - Get single media item
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = mediaIdSchema.parse(req.params);

    const media = await req.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new ApiError(404, 'Media not found');
    }

    const response: ApiResponse<Media> = {
      success: true,
      data: media,
    };

    res.json(response);
  })
);

// POST /api/media - Create new media item
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData: CreateMediaInput = createMediaSchema.parse(req.body);

    // Check if media with same title and year already exists
    const existingMedia = await req.prisma.media.findFirst({
      where: {
        title: validatedData.title,
        year: validatedData.year,
        type: validatedData.type,
      },
    });

    if (existingMedia) {
      throw new ApiError(
        409,
        'Media with this title, year, and type already exists'
      );
    }

    const media = await req.prisma.media.create({
      data: validatedData,
    });

    const response: ApiResponse<Media> = {
      success: true,
      message: 'Media created successfully',
      data: media,
    };

    res.status(201).json(response);
  })
);

// PUT /api/media/:id - Update media item
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = mediaIdSchema.parse(req.params);
    const validatedData: UpdateMediaInput = updateMediaSchema.parse(req.body);

    // Check if media exists
    const existingMedia = await req.prisma.media.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      throw new ApiError(404, "Media not found");
    }

    // If title, year, or type are being updated, check for duplicates
    if (validatedData.title || validatedData.year || validatedData.type) {
      const checkData = {
        title: validatedData.title || existingMedia.title,
        year: validatedData.year || existingMedia.year,
        type: validatedData.type || existingMedia.type,
      };

      const duplicateMedia = await req.prisma.media.findFirst({
        where: {
          ...checkData,
          id: { not: id },
        },
      });

      if (duplicateMedia) {
        throw new ApiError(
          409,
          'Media with this title, year, and type already exists'
        );
      }
    }

    // Handle posterUrl explicitly - if it's undefined or empty string, set to null to remove existing value
    const updateData = { ...validatedData };
    console.log('PUT /api/media/:id - Original validatedData:', validatedData);
    console.log('PUT /api/media/:id - posterUrl value:', validatedData.posterUrl);
    console.log('PUT /api/media/:id - posterUrl type:', typeof validatedData.posterUrl);

    if (validatedData.posterUrl === undefined || validatedData.posterUrl === '' || validatedData.posterUrl === null) {
      updateData.posterUrl = null;
      console.log('PUT /api/media/:id - Setting posterUrl to null');
    }

    console.log('PUT /api/media/:id - Final updateData:', updateData);

    const updatedMedia = await req.prisma.media.update({
      where: { id },
      data: updateData,
    });

    const response: ApiResponse<Media> = {
      success: true,
      message: 'Media updated successfully',
      data: updatedMedia,
    };

    res.json(response);
  })
);

// DELETE /api/media/:id - Delete media item
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = mediaIdSchema.parse(req.params);

    // Check if media exists
    const existingMedia = await req.prisma.media.findUnique({
      where: { id },
    });

    if (!existingMedia) {
      throw new ApiError(404, 'Media not found');
    }

    await req.prisma.media.delete({
      where: { id },
    });

    const response: ApiResponse<{ id: number }> = {
      success: true,
      message: 'Media deleted successfully',
      data: { id },
    };

    res.json(response);
  })
);

// GET /api/media/stats/overview - Get statistics overview
router.get(
  '/stats/overview',
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const [totalCount, movieCount, tvShowCount, genreStats, recentMedia] =
      await Promise.all([
        req.prisma.media.count(),
        req.prisma.media.count({ where: { type: 'MOVIE' } }),
        req.prisma.media.count({ where: { type: 'TV_SHOW' } }),
        req.prisma.media.groupBy({
          by: ['genre'],
          _count: true,
          orderBy: { _count: { genre: 'desc' } },
        }),
        req.prisma.media.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            type: true,
            year: true,
            createdAt: true,
          },
        }),
      ]);

    const response: ApiResponse<MediaStats> = {
      success: true,
      data: {
        totalCount,
        movieCount,
        tvShowCount,
        genreDistribution: genreStats,
        recentlyAdded: recentMedia,
      },
    };

    res.json(response);
  })
);

export default router;
