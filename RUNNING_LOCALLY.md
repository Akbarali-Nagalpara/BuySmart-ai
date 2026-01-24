# Running the Application Locally

## Quick Start

To run the backend locally with your actual credentials:

```powershell
cd Backend
.\mvnw spring-boot:run -D"spring-boot.run.arguments=--spring.profiles.active=local"
```

## Configuration Files

### application.properties (Production/Secure)
The main `application.properties` file uses environment variables for security:
- `${DATABASE_URL}`
- `${DATABASE_USERNAME}`  
- `${DATABASE_PASSWORD}`
- `${APIFY_API_KEY}`
- `${RAPIDAPI_KEY}`

**This file is safe to commit to Git** - it contains no secrets.

### application-local.properties (Development Only)
Located at `src/main/resources/application-local.properties`, this file contains actual credentials for local development.

**⚠️ NEVER commit this file to Git!** It's listed in `.gitignore`.

## Setting Up Local Development

1. **Copy your credentials** to `application-local.properties`:
   ```properties
   spring.datasource.url=your_actual_database_url
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   apify.api.key=your_actual_apify_key
   rapidapi.key=your_actual_rapidapi_key
   ```

2. **Run with local profile**:
   ```powershell
   cd Backend
   .\mvnw spring-boot:run -D"spring-boot.run.arguments=--spring.profiles.active=local"
   ```

## Production Deployment

For production, set environment variables in your deployment platform:

### Heroku
```bash
heroku config:set DATABASE_URL=your_url
heroku config:set DATABASE_USERNAME=your_username
# ... etc
```

### Docker
```yaml
environment:
  - DATABASE_URL=your_url
  - DATABASE_USERNAME=your_username
  # ... etc
```

### System Environment Variables (Windows)
```powershell
[System.Environment]::SetEnvironmentVariable('DATABASE_URL', 'your_url', 'User')
```

Then run normally:
```powershell
.\mvnw spring-boot:run
```

## Important Security Notes

- ✅ `application.properties` - Safe to commit (uses environment variables)
- ❌ `application-local.properties` - Never commit (contains actual secrets)
- ❌ `.env` files - Never commit
- ✅ `.env.example` - Safe to commit (placeholder values only)

## Troubleshooting

### Error: "Unable to determine Dialect without JDBC metadata"
This means Spring Boot can't resolve the environment variables. Make sure you're:
1. Using the local profile: `-D"spring-boot.run.arguments=--spring.profiles.active=local"`
2. OR have environment variables set in your system

### Error: "Driver claims to not accept jdbcUrl, ${DATABASE_URL}"
The literal string `${DATABASE_URL}` is being used instead of its value. This happens when:
1. Environment variable is not set
2. You're not using the local profile
3. The application-local.properties file doesn't exist

## Files to Keep Secure

The following files contain actual credentials and should NEVER be pushed to Git:
- `Backend/src/main/resources/application-local.properties`
- `Backend/.env` (if you create one)
- `Backend/set-env.ps1` (contains credentials in the repository version - consider removing them)
