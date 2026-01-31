# Centralized API Client

This directory contains the centralized axios configuration used throughout the application.

## 📁 Files

- **`api-client.ts`** - Main axios instances with interceptors and configuration

## 🎯 Two API Clients

### 1. Authenticated Client (Default)

```typescript
import apiClient from '@/lib/api-client'
```

- **Purpose:** Authenticated requests that need cookies
- **Credentials:** `withCredentials: true`
- **Use for:**
    - Fetching user data (`/auth/me`)
    - Updating profile (`/auth/profile`)
    - Creating/updating resources owned by user
    - Any endpoint that requires authentication

### 2. Public Client

```typescript
import { publicApiClient } from '@/lib/api-client'
```

- **Purpose:** Unauthenticated requests (login, signup, etc.)
- **Credentials:** `withCredentials: false`
- **Use for:**
    - Login (`/auth/login`)
    - Sign up (`/auth/signup`)
    - Password reset
    - Any public endpoint

## 🚀 Usage

### Basic Import (Authenticated)

```typescript
import apiClient from '@/lib/api-client'

// Make a GET request
const response = await apiClient.get('/users')

// Make a POST request
const response = await apiClient.post('/users', { name: 'John' })

// Make a PUT request
const response = await apiClient.put('/users/1', { name: 'Jane' })

// Make a DELETE request
const response = await apiClient.delete('/users/1')
```

### Public Client (Unauthenticated)

```typescript
import { publicApiClient } from '@/lib/api-client'

// Login (no cookies sent)
const response = await publicApiClient.post('/auth/login', {
    email: 'user@example.com',
    password: 'password'
})

// Sign up (no cookies sent)
const response = await publicApiClient.post('/auth/signup', {
    email: 'user@example.com',
    password: 'password',
    name: 'John Doe'
})
```

### With TypeScript Types

```typescript
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { User } from '@/types'

// Typed authenticated request
const response = await apiClient.get<ApiResponse<User>>('/auth/me')
const user = response.data.data // Type: User

// Typed public request
const response = await publicApiClient.post<ApiResponse<{ user: User }>>('/auth/login', {
    email: 'user@example.com',
    password: 'password'
})
const user = response.data.data.user // Type: User
```

### Helper Functions

```typescript
import { getBaseUrl, getApiVersion, createApiUrl } from '@/lib/api-client'

// Get base URL
const baseUrl = getBaseUrl() // http://localhost:5000

// Get API version
const version = getApiVersion() // v1

// Create full URL
const url = createApiUrl('/auth/login') // http://localhost:5000/api/v1/auth/login
```

## ⚙️ Configuration

The API client is configured with:

- **Base URL:** `${VITE_API_URL}/api/${VITE_API_VERSION}`
- **Credentials:** `withCredentials: true` (includes cookies)
- **Timeout:** 30 seconds
- **Headers:** `Content-Type: application/json`

## 🔒 Features

### Request Interceptor

- Adds Authorization header from cookie
- Logs requests in development mode

### Response Interceptor

- Logs responses in development mode
- Handles common HTTP error codes:
    - **401** - Unauthorized
    - **403** - Forbidden
    - **404** - Not Found
    - **422** - Validation Error
    - **429** - Too Many Requests
    - **500** - Server Error
    - **503** - Service Unavailable
- Provides user-friendly error messages
- Handles network errors

## � HTTP-only Cookie Handling

### Secure by Default

The API client automatically handles HTTP-only cookies set by the server:

- **No JavaScript Access:** HTTP-only cookies cannot be accessed or modified by JavaScript (XSS protection)
- **Automatic Sending:** Cookies are automatically sent with every request (for authenticated client only)
- **Server-Side Management:** Cookies are set and cleared entirely by the server

### Authenticated Client

```typescript
// Automatically includes HTTP-only cookies
// No need to manually add Authorization headers
const response = await apiClient.get('/auth/me')
```

**What happens:**

1. Server sets `access_token` and `refresh_token` cookies (HTTP-only, Secure, SameSite)
2. Browser stores them securely
3. Every request to `apiClient` automatically includes these cookies
4. Server validates the cookie and returns user data

### Public Client

```typescript
// Does NOT include cookies (for unauthenticated endpoints)
const response = await publicApiClient.post('/auth/login', credentials)
```

**What happens:**

1. User provides credentials
2. Server validates and sets HTTP-only cookies
3. Response is returned with Set-Cookie headers
4. Subsequent requests use the cookies (with authenticated client)

### Why No Manual Token Management?

```typescript
// ❌ WRONG - Don't do this
const token = localStorage.getItem('token')  // Vulnerable to XSS!
config.headers.Authorization = `Bearer ${token}`

// ✅ RIGHT - Let the browser handle it
// Just use withCredentials: true
// Cookies are sent automatically!
```

**Benefits:**

- ✅ Protected from XSS attacks
- ✅ Protected from CSRF (with proper SameSite attribute)
- ✅ No manual token management needed
- ✅ Automatic token rotation support
- ✅ Server has full control

## �📊 Standard Response Format

All API responses should follow this format:

```typescript
interface ApiResponse<T> {
    success: boolean    // Request success status
    statusCode: number  // HTTP status code
    data: T            // Response data (typed)
    message: string    // Success/error message
}
```

Example response:

```json
{
    "success": true,
    "statusCode": 200,
    "data": {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com"
    },
    "message": "User fetched successfully"
}
```

## 🛠️ Creating Service Files

When creating new service files, import and use the centralized client:

```typescript
// services/user-service.ts
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { User } from '@/types'

export const getUser = async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
    return response.data.data
}

export const createUser = async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data)
    return response.data.data
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data)
    return response.data.data
}

export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
}
```

## 🔍 Error Handling

### Automatic Error Handling

The API client automatically converts server errors into JavaScript errors with user-friendly messages:

```typescript
try {
    const response = await apiClient.get('/users/invalid-id')
} catch (error) {
    // error.message will contain a user-friendly message
    console.error(error.message) // "The requested resource was not found."
}
```

### With Toast Notifications

For error handling with toast notifications, use the `handleServerError` utility:

```typescript
import { handleServerError } from '@/lib/handle-server-error'
import { publicApiClient } from '@/lib/api-client'

try {
    const response = await publicApiClient.post('/auth/login', credentials)
} catch (error) {
    // Shows error toast + logs error
    handleServerError(error)
}
```

**Features:**

- Shows error message as toast notification
- Handles AxiosError and 204 No Content
- Logs error to console

## 🌍 Environment Variables

Required environment variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_VERSION=v1
```

## 📝 Examples in Codebase

See these files for real-world usage:

- [`pages/landing/services/auth-service.ts`](../pages/landing/services/auth-service.ts) - Auth API calls
- More service files coming soon...

## ⚠️ Best Practices

1. **Always use the centralized client** - Don't create new axios instances
2. **Use TypeScript types** - Type your requests and responses
3. **Extract to service files** - Don't make API calls directly in components
4. **Handle errors in components** - Use try/catch or React Query error handling
5. **Use React Query for data fetching** - Let it handle caching and state
6. **Don't expose sensitive data** - Tokens are in HTTP-only cookies

## 🔄 Migration from Old axios Instances

If you have existing code with custom axios instances:

**Before:**

```typescript
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true
})

const response = await api.get('/users')
```

**After:**

```typescript
import apiClient from '@/lib/api-client'

const response = await apiClient.get('/users')
```

## 🚦 Development vs Production

The API client automatically adjusts based on environment:

- **Development:** Logs all requests and responses to console
- **Production:** Silent operation (no console logs)

This is controlled by `import.meta.env.DEV` checks.
