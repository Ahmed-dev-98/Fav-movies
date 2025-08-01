"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const media_1 = __importDefault(require("./routes/media"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
async function initializeDatabase() {
    if (process.env.NODE_ENV === 'production') {
        try {
            console.log('🔄 Running database migrations...');
            const { execSync } = require('child_process');
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            console.log('✅ Database migrations completed');
        }
        catch (error) {
            console.error('❌ Database migration failed:', error);
            process.exit(1);
        }
    }
}
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN ?
        process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) :
        ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
}));
app.use(limiter);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});
app.use('/api/media', media_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
async function startServer() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`🎬 API endpoints: http://localhost:${PORT}/api/media`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=server.js.map