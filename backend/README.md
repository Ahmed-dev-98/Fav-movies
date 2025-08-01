# FAV Movies Backend

A Node.js/Express backend for managing favorite movies and TV shows with Prisma ORM.

## Features

- RESTful API for media management
- Multi-database support (SQLite, PostgreSQL, MySQL) with Prisma ORM
- Authentication middleware
- Rate limiting and security headers
- CORS support
- Health check endpoint

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Choose your database setup:

**For SQLite (default, easiest):**

```bash
npm run setup:dev
```

**For MySQL:**

```bash
# First, install MySQL and create a database
# Then update .env with MySQL connection string
DATABASE_URL="mysql://username:password@localhost:3306/movie_db"
npm run setup:mysql
```

**For PostgreSQL:**

```bash
# Update .env with PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/movie_db"
npm run setup:prod
```

4. Seed the database (optional):

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Deployment to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)

2. Connect your repository to Render:

   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. Update the `CORS_ORIGIN` in `render.yaml` with your frontend domain

4. Deploy!

### Option 2: Manual Setup

1. Create a new Web Service on Render
2. Connect your Git repository
3. Configure the service:

   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. Add environment variables:

   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (Will be provided by Render PostgreSQL)
   - `CORS_ORIGIN`: Your frontend domain

5. Create a PostgreSQL database on Render and link it to your service

### Environment Variables

- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: Database connection string
- `CORS_ORIGIN`: Allowed origins for CORS (comma-separated)
- `PORT`: Server port (automatically set by Render)

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Media Management

- `GET /api/media` - Get all media items
- `POST /api/media` - Create new media item
- `GET /api/media/:id` - Get media item by ID
- `PUT /api/media/:id` - Update media item
- `DELETE /api/media/:id` - Delete media item

## Database Schema

The application uses a `Media` model with the following fields:

- `id` (Primary Key)
- `title` (String)
- `type` (String)
- `director` (String, optional)
- `budget` (Decimal, optional)
- `location` (String, optional)
- `duration` (Int, optional)
- `year` (Int, optional)
- `genre` (String, optional)
- `rating` (Decimal, optional)
- `description` (String, optional)
- `language` (String, optional)
- `posterUrl` (String, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Database Management

### Switching Between Databases

The application supports multiple database types. Use these commands to switch:

- `npm run setup:dev` - Switch to SQLite (default, easiest setup)
- `npm run setup:mysql` - Switch to MySQL (requires MySQL installation)
- `npm run setup:prod` - Switch to PostgreSQL (production)

> **📖 Detailed Migration Guide**: See [MYSQL_MIGRATION.md](./MYSQL_MIGRATION.md) for step-by-step instructions on setting up MySQL.

### Database Setup Commands

- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio for database management

## Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run type-check` - Type check without building
