# MySQL Migration Guide

This guide will help you migrate from SQLite/PostgreSQL to MySQL.

## Prerequisites

1. **Install MySQL Server** (if running locally)
   - Windows: Download MySQL Installer from https://dev.mysql.com/downloads/installer/
   - macOS: `brew install mysql`
   - Linux: `sudo apt-get install mysql-server`

2. **Install MySQL Client** (for Prisma)
   ```bash
   npm install mysql2
   ```

## Migration Steps

### 1. Set up MySQL Database

**Local Development:**
```bash
# Start MySQL service
# Windows: Start MySQL service from Services
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# Create database
mysql -u root -p
CREATE DATABASE movie_db;
CREATE USER 'movie_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON movie_db.* TO 'movie_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Production (Cloud Providers):**
- **PlanetScale**: Create new database and get connection string
- **Railway**: Deploy MySQL service and get connection string
- **AWS RDS**: Create MySQL instance and get connection string

### 2. Update Environment Variables

Create or update your `.env` file:

```bash
# For local MySQL
DATABASE_URL="mysql://movie_user:your_password@localhost:3306/movie_db"

# For production MySQL (example with PlanetScale)
DATABASE_URL="mysql://username:password@host:port/database"
```

### 3. Run MySQL Setup

```bash
# Switch to MySQL schema and run migrations
npm run setup:mysql
```

This command will:
- Copy the MySQL schema to `schema.prisma`
- Generate Prisma client for MySQL
- Run migrations to create tables

### 4. Verify Migration

```bash
# Check database connection
npm run db:studio

# Or run the application
npm run dev
```

## Switching Between Databases

### Switch to MySQL:
```bash
npm run setup:mysql
```

### Switch back to SQLite:
```bash
npm run setup:dev
```

### Switch to PostgreSQL (production):
```bash
# Update DATABASE_URL to PostgreSQL connection string
npm run setup:prod
```

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Ensure MySQL service is running
   - Check if port 3306 is available
   - Verify credentials in DATABASE_URL

2. **Authentication Failed**
   - Double-check username/password
   - Ensure user has proper privileges
   - Try connecting with MySQL client first

3. **Migration Errors**
   - Drop existing database and recreate
   - Check for conflicting table names
   - Ensure MySQL version compatibility (8.0+ recommended)

### Useful Commands:

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration history
npx prisma migrate status

# Generate new migration
npx prisma migrate dev --name init

# Push schema without migrations (development only)
npx prisma db push
```

## Production Deployment

When deploying to production:

1. Update your hosting platform's environment variables
2. Set `DATABASE_URL` to your production MySQL connection string
3. Run `npm run setup:prod` to apply migrations
4. Ensure your MySQL instance is accessible from your application

## Performance Considerations

- MySQL typically performs better than SQLite for concurrent users
- Consider connection pooling for production
- Monitor query performance with Prisma Studio
- Use indexes for frequently queried fields