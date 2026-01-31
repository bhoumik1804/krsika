# Centralized API Client Migration

## ✨ What Changed

The application now uses a **centralized axios instance** instead of creating multiple instances across different services.

## 📁 New Files Created

1. **`src/lib/api-client.ts`** - Centralized axios configuration
2. **`src/lib/API_CLIENT.md`** - Complete documentation

## 🔄 Updated Files

1. **`src/pages/landing/services/auth-service.ts`** - Now uses `apiClient` from `@/lib/api-client`

## 🎯 Benefits

### Before (Decentralized)

```typescript
// Each service created its own axios instance
import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:5000/api/v1/auth',
    withCredentials: true
})

const userApi = axios.create({
    baseURL: 'http://localhost:5000/api/v1/users',
    withCredentials: true
})
// ... duplicate configuration everywhere
```

**Problems:**
- ❌ Duplicate configuration in every service
- ❌ Inconsistent error handling
- ❌ Hard to change base URL or add headers globally
- ❌ Interceptors need to be added to each instance
- ❌ Difficult to maintain

### After (Centralized)

```typescript
// All services use the same instance
import apiClient from '@/lib/api-client'

// Auth service
const response = await apiClient.get('/auth/me')

// User service
const response = await apiClient.get('/users/1')

// Mill service
const response = await apiClient.get('/mills')
```

**Benefits:**
- ✅ Single source of configuration
- ✅ Consistent error handling across all requests
- ✅ Easy to update base URL or headers globally
- ✅ Interceptors apply to all requests automatically
- ✅ Easy to maintain and update

## 🚀 How to Use in New Services

### 1. Import the centralized client

```typescript
import apiClient, { type ApiResponse } from '@/lib/api-client'
```

### 2. Use it for all HTTP requests

```typescript
// GET request
const response = await apiClient.get<ApiResponse<User>>('/users/1')
const user = response.data.data

// POST request
const response = await apiClient.post<ApiResponse<User>>('/users', {
    name: 'John Doe',
    email: 'john@example.com'
})

// PUT request
const response = await apiClient.put<ApiResponse<User>>('/users/1', {
    name: 'Jane Doe'
})

// DELETE request
await apiClient.delete('/users/1')
```

### 3. Extract response data

The API follows this standard format:

```typescript
{
    success: boolean
    statusCode: number
    data: T          // Your actual data
    message: string
}
```

So you typically access data via `response.data.data`.

## 🛠️ Features

### Request Interceptor

- Automatically adds `Authorization` header from cookies
- Logs all requests in development mode

### Response Interceptor

- Automatically converts server errors to user-friendly messages
- Handles common HTTP status codes (401, 403, 404, 422, 429, 500, 503)
- Logs all responses in development mode

### Error Handling

```typescript
try {
    const response = await apiClient.get('/users/999')
} catch (error) {
    // Error message is already user-friendly
    console.error(error.message) // "The requested resource was not found."
}
```

## 📊 Configuration

The API client is configured with:

- **Base URL:** `${VITE_API_URL}/api/${VITE_API_VERSION}`
- **Credentials:** `withCredentials: true` (includes HTTP-only cookies)
- **Timeout:** 30 seconds
- **Content-Type:** `application/json`

## 🔐 Authentication

The client automatically:
- Includes cookies in all requests
- Adds Authorization header from cookie
- Handles 401 Unauthorized errors

No need to manually manage tokens!

## 📚 Documentation

For complete documentation, see:
- [`src/lib/API_CLIENT.md`](./src/lib/API_CLIENT.md) - Full API client guide
- [`src/pages/landing/INTEGRATION_SUMMARY.md`](./src/pages/landing/INTEGRATION_SUMMARY.md) - Auth integration overview

## 🎓 Example: Creating a New Service

```typescript
// src/services/mill-service.ts
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { Mill } from '@/types'

export const getMills = async (): Promise<Mill[]> => {
    const response = await apiClient.get<ApiResponse<Mill[]>>('/mills')
    return response.data.data
}

export const getMill = async (id: string): Promise<Mill> => {
    const response = await apiClient.get<ApiResponse<Mill>>(`/mills/${id}`)
    return response.data.data
}

export const createMill = async (data: Partial<Mill>): Promise<Mill> => {
    const response = await apiClient.post<ApiResponse<Mill>>('/mills', data)
    return response.data.data
}

export const updateMill = async (id: string, data: Partial<Mill>): Promise<Mill> => {
    const response = await apiClient.put<ApiResponse<Mill>>(`/mills/${id}`, data)
    return response.data.data
}

export const deleteMill = async (id: string): Promise<void> => {
    await apiClient.delete(`/mills/${id}`)
}
```

## ⚠️ Migration Checklist

When migrating existing services:

1. ✅ Remove local axios instance creation
2. ✅ Import `apiClient` from `@/lib/api-client`
3. ✅ Update all requests to use `apiClient`
4. ✅ Add `/resource-name` to paths (base URL is already set)
5. ✅ Remove custom error handling (centralized now)
6. ✅ Update types to use `ApiResponse<T>`

## 🔍 Example Migration

**Before:**
```typescript
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api/v1/users'
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Custom error handling
    }
)

export const getUser = async (id: string) => {
    const response = await api.get(`/${id}`)
    return response.data
}
```

**After:**
```typescript
import apiClient, { type ApiResponse } from '@/lib/api-client'
import type { User } from '@/types'

export const getUser = async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`)
    return response.data.data
}
```

## 🎉 Result

- **Cleaner code** - Less boilerplate
- **Type safety** - TypeScript throughout
- **Consistency** - Same pattern everywhere
- **Maintainability** - Change once, apply everywhere
- **Better DX** - Easier to understand and use

## 🚦 Next Steps

1. Use `apiClient` for all new services
2. Gradually migrate existing services
3. Remove old axios instances
4. Enjoy the benefits! 🎊
