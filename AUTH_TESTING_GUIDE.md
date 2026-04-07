# Testing JWT Authentication

## Prerequisites
- Project running: `npm run start:dev`
- API testing tool: Postman, Insomnia, or curl

## Testing Steps

### Step 1: Create a User

**POST** `/users`

```json
{
  "email": "testuser@example.com",
  "password": "SecurePass123",
  "name": "Test User",
  "is_active": true
}
```

### Step 2: Login and Get Tokens

**POST** `/auth/login`

```json
{
  "email": "testuser@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MTIyNDU2MDAsImV4cCI6MTcxMjI0NjUwMH0.xxxxx",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MTIyNDU2MDAsImV4cCI6MTcxMjg1MDQwMH0.xxxxx",
  "expires_in": 900,
  "user": {
    "id": 1,
    "email": "testuser@example.com",
    "name": "Test User"
  }
}
```

### Step 3: Use Access Token for Protected Endpoints

**GET** `/api/protected/profile`

Headers:
```
Authorization: Bearer <access_token_from_step_2>
```

### Step 4: Refresh Token (After 15 minutes or when access token expires)

**POST** `/auth/refresh`

```json
{
  "refresh_token": "<refresh_token_from_step_2>"
}
```

You'll get a new access_token and refresh_token.

## Using Postman / Insomnia

### 1. Set up Environment Variables:
```
base_url: http://localhost:3000
access_token: (empty initially)
refresh_token: (empty initially)
```

### 2. Login Request Script:
In Tests tab, add:
```javascript
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.access_token);
pm.environment.set("refresh_token", jsonData.refresh_token);
```

### 3. Protected Route Headers:
```
Authorization: Bearer {{access_token}}
```

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Missing or invalid token | Check token in Authorization header |
| `Invalid or expired refresh token` | Refresh token expired (7 days) | User must login again |
| `Invalid email or password` | Wrong credentials | Verify email and password |
| `User not found` | User deleted or doesn't exist | Create user first |

## Token Refresh Flow

Client should refresh token:
- Every 14 minutes (before 15-minute access token expiry)
- Or when receiving 401 Unauthorized response

```javascript
// Example: Auto-refresh every 14 minutes
setInterval(async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (refreshToken) {
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    }
  }
}, 14 * 60 * 1000); // 14 minutes
```
