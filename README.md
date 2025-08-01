# 🎬 Movie Management System

A full-stack application for managing your favorite movies and TV shows. Built with React, TypeScript, Node.js, Express, and Prisma ORM.

## 🌟 Features

### Frontend

- **Modern UI**: Clean, responsive design with Shadcn UI components
- **Full CRUD Operations**: Add, view, edit, and delete media entries
- **Infinite Scroll**: Seamless pagination for large collections
- **Advanced Search & Filtering**: Search by title, director, description with filters for type, genre, year
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Feedback**: Toast notifications for all actions
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Comprehensive validation using Zod and react-hook-form

### Backend

- **RESTful API**: Complete CRUD operations for media management
- **Multi-database Support**: SQLite (development), MySQL, PostgreSQL (production)
- **Prisma ORM**: Type-safe database operations
- **Rate Limiting**: Built-in security with express-rate-limit
- **CORS Support**: Configurable cross-origin resource sharing
- **Health Check**: Server status monitoring
- **Input Validation**: Zod schema validation

## 🛠️ Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Databases**: SQLite, MySQL, PostgreSQL

## 📦 Prerequisites

- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Database**: SQLite (included), MySQL, or PostgreSQL (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd movie-task
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Setup database (SQLite for development)
npm run setup:dev

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:3000" > .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🗄️ Database Setup

### Option 1: SQLite (Recommended for Development)

SQLite is the easiest option for development and requires no additional setup:

```bash
cd backend
npm run setup:dev
```

### Option 2: MySQL

1. **Install MySQL** on your system
2. **Create a database**:
   ```sql
   CREATE DATABASE movie_db;
   ```
3. **Update environment variables** in `backend/.env`:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/movie_db"
   ```
4. **Setup MySQL schema**:
   ```bash
   cd backend
   npm run setup:mysql
   ```

### Option 3: PostgreSQL

1. **Install PostgreSQL** on your system
2. **Create a database**:
   ```sql
   CREATE DATABASE movie_db;
   ```
3. **Update environment variables** in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/movie_db"
   ```
4. **Setup PostgreSQL schema**:
   ```bash
   cd backend
   npm run setup:prod
   ```

## 📊 Database Schema

The application uses a `Media` model with the following structure:

```sql
model Media {
  id          String   @id @default(cuid())
  title       String
  type        String   // "MOVIE" or "TV_SHOW"
  director    String?
  budget      Decimal?
  location    String?
  duration    Int?     // in minutes
  year        Int?
  genre       String?
  rating      Decimal?
  description String?
  language    String?
  posterUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Field Descriptions

- **title**: The name of the movie or TV show (required)
- **type**: Either "MOVIE" or "TV_SHOW" (required)
- **director**: The director's name (optional)
- **budget**: Production budget in dollars (optional)
- **location**: Filming location (optional)
- **duration**: Runtime in minutes (optional)
- **year**: Release year (optional)
- **genre**: Genre category (optional)
- **rating**: User rating (0-10 scale, optional)
- **description**: Plot summary (optional)
- **language**: Primary language (optional)
- **posterUrl**: URL to movie poster image (optional)

## 🌱 Seed Data

The application comes with 30+ sample movies and TV shows including:

- **Movies**: The Shawshank Redemption, The Godfather, Inception, The Dark Knight, etc.
- **TV Shows**: Breaking Bad, Stranger Things, Game of Thrones, Friends, etc.

To seed the database:

```bash
cd backend
npm run db:seed
```

## 🔧 Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"  # SQLite (development)
# DATABASE_URL="mysql://username:password@localhost:3306/movie_db"  # MySQL
# DATABASE_URL="postgresql://username:password@localhost:5432/movie_db"  # PostgreSQL

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 📋 Available Scripts

### Backend Scripts

```bash
cd backend

# Development
npm run dev              # Start development server
npm run build           # Build TypeScript to JavaScript
npm run start           # Start production server
npm run type-check      # Type check without building

# Database
npm run db:migrate      # Run database migrations
npm run db:generate     # Generate Prisma client
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio for database management

# Setup
npm run setup:dev       # Setup SQLite database
npm run setup:mysql     # Setup MySQL database
npm run setup:prod      # Setup PostgreSQL database
```

### Frontend Scripts

```bash
cd frontend

npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## 🌐 API Endpoints

### Health Check

- `GET /health` - Server health status

### Media Management

- `GET /api/media` - Get all media items (with pagination and filters)
- `POST /api/media` - Create new media item
- `GET /api/media/:id` - Get media item by ID
- `PUT /api/media/:id` - Update media item
- `DELETE /api/media/:id` - Delete media item
- `GET /api/media/stats/overview` - Get collection statistics

### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search in title, director, description
- `type`: Filter by type (MOVIE, TV_SHOW)
- `genre`: Filter by genre
- `year`: Filter by year
- `sortBy`: Sort field (title, year, rating, createdAt)
- `sortOrder`: Sort order (asc, desc)

## 🚀 Deployment

### Backend Deployment (Render)

1. **Push to Git repository**
2. **Connect to Render**:

   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the `render.yaml` file

3. **Update CORS settings** in `render.yaml` with your frontend domain

4. **Deploy!**

### Frontend Deployment (Vercel)

1. **Push to Git repository**
2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

3. **Add environment variables**:

   - `VITE_API_URL`: Your backend API URL

4. **Deploy!**

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check `DATABASE_URL` in `.env`
   - Ensure database server is running
   - Verify database credentials

2. **Frontend Can't Connect to Backend**

   - Ensure backend is running on port 3000
   - Check `VITE_API_URL` in frontend `.env`
   - Verify CORS settings in backend

3. **Prisma Errors**

   - Run `npm run db:generate` to regenerate Prisma client
   - Run `npm run db:migrate` to apply migrations
   - Check database connection string

4. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

### Development Tips

- Use **Prisma Studio** for database management: `npm run db:studio`
- Check **browser console** for frontend errors
- Monitor **server logs** for backend issues
- Use **Postman** or **curl** to test API endpoints

## 📁 Project Structure

```
movie-task/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Main server file
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Database seed data
│   │   └── migrations/     # Database migrations
│   ├── package.json
│   └── README.md
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # API client
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities
│   ├── package.json
│   └── README.md
└── README.md              # This file
```
