# Docker Setup Guide for BuySmart-AI

This project is fully containerized using Docker and Docker Compose, making it easy to run all services with a single command.

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (included with Docker Desktop)

## Project Architecture

The application consists of three services:

1. **Backend** - Spring Boot application (Java 21) running on port 8080
2. **Frontend** - React/Vite application served via Nginx on port 80
3. **AI Service** - Python FastAPI service running on port 5001

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` and provide your actual values for:
- Supabase database credentials
- RapidAPI keys
- Apify API key
- Google Gemini API key

### 2. Build and Run All Services

```bash
docker-compose up --build
```

This command will:
- Build Docker images for all three services
- Start all containers
- Set up networking between services
- Map ports to your host system

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **AI Service API**: http://localhost:5001
- **AI Service Docs**: http://localhost:5001/docs

## Docker Commands

### Start services (background mode)
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ai-service
```

### Rebuild a specific service
```bash
docker-compose build backend
docker-compose build frontend
docker-compose build ai-service
```

### Restart a service
```bash
docker-compose restart backend
```

### Remove all containers, networks, and volumes
```bash
docker-compose down -v
```

## Service Details

### Backend (Spring Boot)
- **Build**: Multi-stage build using Maven 3.9 and Eclipse Temurin JDK 21
- **Runtime**: Eclipse Temurin JRE 21
- **Port**: 8080
- **Health Check**: Available at `/actuator/health`

### Frontend (React/Vite)
- **Build**: Multi-stage build using Node 20
- **Runtime**: Nginx Alpine
- **Port**: 80
- **Features**: 
  - Optimized production build
  - Gzip compression enabled
  - SPA routing support
  - Static asset caching

### AI Service (Python FastAPI)
- **Runtime**: Python 3.11 Slim
- **Port**: 5001
- **API Documentation**: Available at `/docs`

## Development vs Production

### Development Mode
For local development without Docker, refer to the existing setup guides:
- Backend: Run with `mvn spring-boot:run` in the Backend directory
- Frontend: Run with `npm run dev` in the Frontend directory
- AI Service: Run with `start.bat` in the product-ai-analysis directory

### Production Mode (Docker)
The Docker setup is optimized for production with:
- Multi-stage builds for smaller image sizes
- Health checks for all services
- Automatic restarts on failure
- Proper networking and isolation

## Troubleshooting

### Port conflicts
If ports 80, 8080, or 5001 are already in use, you can modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # Frontend on port 3000 instead of 80
```

### Container won't start
Check logs for the specific service:
```bash
docker-compose logs backend
```

### Database connection issues
Ensure your `.env` file has correct Supabase credentials and that the database is accessible from Docker containers.

### Rebuilding after code changes
After making code changes, rebuild the affected service:
```bash
docker-compose up --build backend
```

## Notes

- The Docker setup does not modify any existing application logic
- All services communicate through the `buysmart-network` Docker network
- Environment variables are passed from the `.env` file
- Each service has its own `.dockerignore` to optimize build context
