# Planning Center API Wrapper

Easy-to-use Planning Center API wrapper with built-in rate limiting and flexible authentication.

## Installation

```bash
npm install planning-center-api
```

## Features

- 🔐 **Flexible Authentication**: Basic auth or Bearer token with auto-refresh
- ⚡ **Rate Limiting**: Automatic rate limit handling with retries
- 🔄 **Auto Token Refresh**: Automatically refreshes access tokens when needed
- 📝 **TypeScript**: Full TypeScript support with types
- 🎯 **Fluent API**: Intuitive, chainable API design

## Usage

### Using Environment Variables (Easiest!)

Create a `.env` or `.env.local` file:

```env
PCO_API_CLIENT_ID=your_client_id
PCO_API_SECRET=your_client_secret
```

Then just initialize without config:

```typescript
import { PlanningCenter } from "planning-center-api";

const pc = new PlanningCenter();
// Automatically uses PCO_API_CLIENT_ID and PCO_API_SECRET from ENV
```

### Basic Authentication (Explicit)

```typescript
import { PlanningCenter } from "planning-center-api";

const pc = new PlanningCenter({
  auth: {
    type: "basic",
    clientId: "your_client_id",
    clientSecret: "your_client_secret",
  },
});
```

### Bearer Token Authentication with Auto-Refresh

```typescript
const pc = new PlanningCenter({
  auth: {
    type: "bearer",
    bearerToken: "your_access_token",
    refreshToken: "your_refresh_token", // required for autoRefresh
    autoRefresh: true, // enables automatic token refresh
    clientId: "your_oauth_client_id", // required for token refresh
    clientSecret: "your_oauth_client_secret", // required for token refresh
    lastRefreshedAt: new Date(), // optional, for proactive refresh
    tokenExpiryMs: 7200000, // optional, defaults to 2 hours
    onTokenRefresh: async (tokens) => {
      // This callback is called whenever tokens are refreshed
      console.log("New access token:", tokens.accessToken);
      console.log("New refresh token:", tokens.refreshToken);
      // Save these tokens to your database or storage
      await saveTokens(tokens);
    },
  },
});
```

**Note:** If you don't provide `clientId` and `clientSecret`, the client will look for these environment variables:
- `PCO_CLIENT_ID` or `NEXT_PUBLIC_PCO_CLIENT_ID`
- `PCO_SECRET` or `PCO_CLIENT_SECRET`

### Get a Person

```typescript
const { data } = await pc.people.person("123").get();
console.log(data); // Person object
```

### Create a Person

```typescript
const { data } = await pc.people.person().create({
  first_name: "Jane",
  last_name: "Doe",
  birthdate: "1990-01-01",
});
```

### Update a Person

```typescript
await pc.people.person("123").update({
  first_name: "John",
  last_name: "Smith",
});
```

### Delete a Person

```typescript
await pc.people.person("123").delete();
```

## Configuration Options

```typescript
const pc = new PlanningCenter({
  auth: {
    /* ... */
  },
  rateLimitDelay: 100, // ms between requests (default: 100)
  maxRetries: 3, // max retries for rate limits (default: 3)
  autoPaginate: true, // automatically fetch all pages (default: true)
});
```

## Token Refresh

When using bearer token auth with `autoRefresh: true`, the wrapper handles token refresh in two ways:

### 1. Reactive Refresh (on 401)

Automatically refreshes when a request fails with 401 Unauthorized.

### 2. Proactive Refresh (before expiry)

If you provide `lastRefreshedAt`, it will proactively refresh tokens 5 minutes before they expire (default 2 hour expiry).

### Using the onTokenRefresh Callback

The recommended way to handle token refresh is to provide an `onTokenRefresh` callback. This callback is called automatically whenever tokens are refreshed (either reactively or proactively), allowing you to save the new tokens to your database or storage:

```typescript
// Example: Create a singleton client in your app
import { PlanningCenter } from "planning-center-api";

let accessToken = "initial_access_token";
let refreshToken = "initial_refresh_token";

const pc = new PlanningCenter({
  auth: {
    type: "bearer",
    bearerToken: accessToken,
    refreshToken: refreshToken,
    autoRefresh: true,
    clientId: process.env.PCO_CLIENT_ID!, // OAuth client ID
    clientSecret: process.env.PCO_SECRET!, // OAuth client secret
    lastRefreshedAt: new Date("2024-01-01T10:00:00Z"), // When token was issued
    tokenExpiryMs: 7200000, // 2 hours (default)
    onTokenRefresh: async (tokens) => {
      // This is called automatically when tokens are refreshed
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;

      // Save to your database
      await db.updateTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        lastRefreshedAt: new Date(),
      });
    },
  },
});

// Now you can use the client throughout your app
// and it will automatically handle token refresh
const { data } = await pc.people.person("123").get();
```

## Pagination Control

By default, the client automatically fetches all pages for list requests (`autoPaginate: true`). You can control this behavior globally or per-request:

### Global Setting

```typescript
const pc = new PlanningCenter({
  auth: { /* ... */ },
  autoPaginate: false, // Disable auto-pagination globally
});
```

### Per-Request Control

```typescript
// Get only the first 25 people (no auto-pagination)
const { data } = await pc.people.list({
  per_page: 25,
  autoPaginate: false,
});

// Get exactly 50 people starting at offset 100
const { data } = await pc.people.list({
  per_page: 50,
  offset: 100,
  autoPaginate: false,
});

// Auto-paginate with custom page size (fetches all pages, 100 at a time)
const { data } = await pc.people.list({
  per_page: 100,
  autoPaginate: true,
});
```

### Manual Pagination

You can also manually paginate through results:

```typescript
let offset = 0;
const perPage = 25;
let hasMore = true;

while (hasMore) {
  const response = await pc.people.list({
    per_page: perPage,
    offset: offset,
    autoPaginate: false,
  });

  console.log(`Fetched ${response.data.length} people`);

  // Check if there's a next page
  hasMore = !!response.links?.next;
  offset += perPage;
}
```

## API Reference

### PlanningCenter

Main client class.

#### Constructor Options

- `auth`: Authentication configuration (required)
  - `type`: `'basic'` or `'bearer'`
  - For basic: `clientId` and `clientSecret`
  - For bearer: `bearerToken`, optional `refreshToken`, `autoRefresh`, `lastRefreshedAt`, `tokenExpiryMs`, and `onTokenRefresh`
- `rateLimitDelay`: Milliseconds between requests (default: 100)
- `maxRetries`: Maximum retries for rate limiting (default: 3)
- `autoPaginate`: Automatically fetch all pages for GET requests (default: true)

### People App

Access the People app via `pc.people`.

#### person(id?: string)

Returns a PersonResource for the given ID.

### PersonResource

Methods available on a person resource:

- `get()`: Get person by ID
- `create(attributes)`: Create a new person
- `update(attributes)`: Update a person
- `delete()`: Delete a person

## License

MIT
