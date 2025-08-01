"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaSchemas_1 = require("../schemas/mediaSchemas");
const errorHandler_1 = require("../middleware/errorHandler");
require("../types/express");
const router = express_1.default.Router();
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const queryParams = mediaSchemas_1.paginationSchema.parse(req.query);
    const { page, limit, search, type, genre, year, sortBy, sortOrder } = queryParams;
    const skip = (page - 1) * limit;
    const whereConditions = {};
    if (search) {
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
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
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
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const response = {
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
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = mediaSchemas_1.mediaIdSchema.parse(req.params);
    const media = await req.prisma.media.findUnique({
        where: { id },
    });
    if (!media) {
        throw new errorHandler_1.ApiError(404, 'Media not found');
    }
    const response = {
        success: true,
        data: media,
    };
    res.json(response);
}));
router.post('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = mediaSchemas_1.createMediaSchema.parse(req.body);
    const existingMedia = await req.prisma.media.findFirst({
        where: {
            title: validatedData.title,
            year: validatedData.year,
            type: validatedData.type,
        },
    });
    if (existingMedia) {
        throw new errorHandler_1.ApiError(409, 'Media with this title, year, and type already exists');
    }
    const media = await req.prisma.media.create({
        data: validatedData,
    });
    const response = {
        success: true,
        message: 'Media created successfully',
        data: media,
    };
    res.status(201).json(response);
}));
router.put('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = mediaSchemas_1.mediaIdSchema.parse(req.params);
    const validatedData = mediaSchemas_1.updateMediaSchema.parse(req.body);
    const existingMedia = await req.prisma.media.findUnique({
        where: { id },
    });
    if (!existingMedia) {
        throw new errorHandler_1.ApiError(404, "Media not found");
    }
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
            throw new errorHandler_1.ApiError(409, 'Media with this title, year, and type already exists');
        }
    }
    const updatedMedia = await req.prisma.media.update({
        where: { id },
        data: validatedData,
    });
    const response = {
        success: true,
        message: 'Media updated successfully',
        data: updatedMedia,
    };
    res.json(response);
}));
router.delete('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = mediaSchemas_1.mediaIdSchema.parse(req.params);
    const existingMedia = await req.prisma.media.findUnique({
        where: { id },
    });
    if (!existingMedia) {
        throw new errorHandler_1.ApiError(404, 'Media not found');
    }
    await req.prisma.media.delete({
        where: { id },
    });
    const response = {
        success: true,
        message: 'Media deleted successfully',
        data: { id },
    };
    res.json(response);
}));
router.get('/stats/overview', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [totalCount, movieCount, tvShowCount, genreStats, recentMedia] = await Promise.all([
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
    const response = {
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
}));
exports.default = router;
//# sourceMappingURL=media.js.map