# BuySmart AI - Product Analysis Service

## Quick Start Guide

### 1. Python AI Service (Port 5001)

The Python service handles AI-powered product analysis using Google Gemini.

#### Setup:
```bash
cd product-ai-analysis

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Gemini API key
echo GEMINI_API_KEY=your_gemini_api_key_here > .env
```

#### Run:
```bash
# Option 1: Using the batch file (Windows)
start.bat

# Option 2: Manual command
uvicorn app.main:app --reload --port 5001
```

The service will be available at: http://localhost:5001

### 2. Spring Boot Backend (Port 8080)

#### Run:
```bash
cd Backend

# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
```

The backend will be available at: http://localhost:8080

### 3. React Frontend (Port 5173)

#### Setup & Run:
```bash
cd Frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## Configuration

### Backend Configuration (application.properties)

```properties
# AI Service Configuration
ai.enabled=false                           # Set to true to enable AI analysis
ai.service.url=http://localhost:5001/analyze

# RapidAPI Configuration
rapidapi.key=your_rapidapi_key
rapidapi.host=real-time-amazon-data.p.rapidapi.com
rapidapi.base-url=https://real-time-amazon-data.p.rapidapi.com
```

### AI Modes

1. **AI Disabled (ai.enabled=false)**: 
   - Uses local parsing for product data
   - No external AI service needed
   - Faster but less intelligent analysis

2. **AI Enabled (ai.enabled=true)**:
   - Sends product data to Python service
   - Uses Google Gemini for intelligent analysis
   - Requires Python service running on port 5001
   - Falls back to local parsing if service unavailable

## How It Works

### Product Analysis Flow:

1. **User searches** for a product in the frontend
2. **Frontend sends** search query to backend `/api/products/search`
3. **Backend fetches** product details from RapidAPI (Amazon data)
4. **User clicks** "Analyze" button
5. **Frontend sends** analyze request to `/api/products/analyze`
6. **Backend**:
   - Checks if raw data is cached
   - If not cached, fetches from RapidAPI
   - Saves raw data to cache
   - Sends to AI service (if enabled) OR uses local parsing
7. **Python AI Service** (if enabled):
   - Receives raw product data
   - Builds analysis prompt
   - Sends to Google Gemini
   - Returns structured analysis
8. **Backend saves** analyzed product to database
9. **Frontend displays** analysis results

## Troubleshooting

### Issue: "404 Not Found" on /api/products/analyze

**Solution**: 
- Ensure backend is running on port 8080
- Check that the endpoint is registered in ProductController
- Verify CORS configuration allows frontend origin

### Issue: "No raw data found for productId"

**Solution**:
- The fix has been applied - backend now fetches data automatically if not cached
- Ensure RapidAPI key is valid in application.properties

### Issue: Python service connection failed

**Solution**:
- Check if Python service is running: `curl http://localhost:5001`
- Verify .env file has GEMINI_API_KEY
- Set ai.enabled=false to use local parsing as fallback

### Issue: Uvicorn command error

**Solution**:
Use correct command: `uvicorn app.main:app --reload --port 5001`
Not: `uvicorn app.main;app --reload` (semicolon is wrong)

## API Endpoints

### Backend Endpoints:

- `GET /api/products/search?query={query}` - Search products
- `POST /api/products/analyze` - Analyze a product
  ```json
  {
    "productId": "B0ABC123",
    "productName": "Product Name",
    "brand": "Brand Name"
  }
  ```
- `GET /api/products/{productId}` - Get product details
- `GET /api/cache/{productId}` - Get cached raw data

### Python AI Service:

- `POST /analyze` - Analyze product data
  ```json
  {
    "title": "Product Title",
    "brand": "Brand",
    "price": "99.99",
    "rating": 4.5,
    "reviews": [...],
    ...
  }
  ```

## Recent Fixes Applied

1. ✅ Fixed incorrect Jackson imports (tools.jackson → com.fasterxml.jackson)
2. ✅ Fixed deprecated JWT methods (Jwts.parser() → Jwts.parserBuilder())
3. ✅ Fixed BCryptPasswordEncoder injection instead of new instances
4. ✅ Enhanced /analyze endpoint to auto-fetch product data if not cached
5. ✅ Added fallback to local parsing if AI service fails
6. ✅ Improved error handling and logging throughout the flow
7. ✅ Created start.bat for easy Python service startup
8. ✅ Fixed product search to show only one result
9. ✅ Removed dollar sign from price display
