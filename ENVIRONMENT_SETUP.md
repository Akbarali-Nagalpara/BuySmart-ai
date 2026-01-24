# Environment Configuration

This project requires environment variables for sensitive configuration. Follow these steps to set them up:

## Backend Configuration

1. Copy the example environment file:
   ```bash
   cd Backend
   cp .env.example .env
   ```

2. Edit the `.env` file and add your actual values:
   ```properties
   DATABASE_URL=jdbc:postgresql://your-host:5432/postgres
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   APIFY_API_KEY=your_apify_api_key_here
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

## Important Security Notes

- **Never commit `.env` files to version control**
- The `.env.example` file should contain placeholder values only
- Keep your API keys and passwords secure
- Rotate any exposed credentials immediately

## Setting Environment Variables in Spring Boot

Spring Boot automatically loads environment variables. You can also use these alternative methods:

### Option 1: System Environment Variables
Set environment variables in your system or IDE run configuration.

### Option 2: Application Properties with Environment Variables
The `application.properties` file uses `${VARIABLE_NAME}` syntax to reference environment variables.

### Option 3: Spring Profiles
Create profile-specific properties files like `application-dev.properties` or `application-prod.properties`.

## Getting API Keys

- **RapidAPI Key**: Sign up at [RapidAPI](https://rapidapi.com/) and subscribe to the Real-Time Amazon Data API
- **Apify API Key**: Create an account at [Apify](https://apify.com/) and get your API token from the settings

## Supabase Database Connection

Your DATABASE_URL should include SSL mode for Supabase connections:
```
jdbc:postgresql://your-project.supabase.co:5432/postgres?sslmode=require
```

The connection pooling configuration is already set in `application.properties`.
