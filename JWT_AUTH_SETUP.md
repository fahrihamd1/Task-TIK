# JWT Authentication Setup

## Overview
This project now includes JWT authentication with automatic token refresh. Here's how it works:

### Token Configuration
- **Access Token**: Expires in **15 minutes** (900 seconds)
- **Refresh Token**: Expires in **7 days** (604800 seconds)

## API Endpoints

### 1. Login Endpoint
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 2. Refresh Token Endpoint
**POST** `/auth/refresh`

Request body:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Using Protected Routes

To protect any route, use the `@UseGuards(JwtAuthGuard)` decorator:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards';

@Controller('api')
export class YourController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected() {
    return { message: 'This route is protected' };
  }
}
```

## Client-Side Implementation (Frontend)

### Using Axios Example:
```javascript
// 1. Login
const response = await axios.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const { access_token, refresh_token, expires_in } = response.data;

// Store tokens
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// 2. Use access token for requests
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

// 3. Refresh token when needed (every 14 minutes, before expiry)
setInterval(async () => {
  const refresh = localStorage.getItem('refresh_token');
  const result = await axios.post('/auth/refresh', {
    refresh_token: refresh
  });
  
  localStorage.setItem('access_token', result.data.access_token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.access_token}`;
}, 14 * 60 * 1000); // Refresh every 14 minutes
```

## Environment Variables

Create a `.env` file in the project root:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
```

## File Structure

```
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── auth-response.dto.ts
│   │   └── refresh-token.dto.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── refresh-token.strategy.ts
│   │   └── index.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── refresh-token.guard.ts
│   │   └── index.ts
│   ├── interfaces/
│   │   └── jwt-payload.interface.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── constants.ts
```

## Key Features

✅ **15-minute Access Token**: Short expiration for security
✅ **7-day Refresh Token**: Longer expiration for convenience
✅ **Password Hashing**: Using bcrypt for secure password storage
✅ **JWT Verification**: Validates token signature and expiration
✅ **Easy Route Protection**: Use guards to protect endpoints
✅ **Refresh Token Rotation**: Get new tokens without re-logging
