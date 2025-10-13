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

### Bearer Token Authentication

```typescript
const pc = new PlanningCenter({
  auth: {
    type: "bearer",
    bearerToken: "your_access_token",
    refreshToken: "your_refresh_token", // optional
    autoRefresh: true, // optional, defaults to false
    lastRefreshedAt: new Date(), // optional, for proactive refresh
    tokenExpiryMs: 7200000, // optional, defaults to 2 hours
  },
});
```

### Get a Person

```typescript
const { data, tokens } = await pc.people.person("123").get();
console.log(data); // Person object
console.log(tokens); // Refreshed tokens if auto-refresh is enabled
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
});
```

## Token Refresh

When using bearer token auth with `autoRefresh: true`, the wrapper handles token refresh in two ways:

### 1. Reactive Refresh (on 401)

Automatically refreshes when a request fails with 401 Unauthorized.

### 2. Proactive Refresh (before expiry)

If you provide `lastRefreshedAt`, it will proactively refresh tokens 5 minutes before they expire (default 2 hour expiry).

```typescript
const pc = new PlanningCenter({
  auth: {
    type: "bearer",
    bearerToken: "your_access_token",
    refreshToken: "your_refresh_token",
    autoRefresh: true,
    lastRefreshedAt: new Date("2024-01-01T10:00:00Z"), // When token was issued
    tokenExpiryMs: 7200000, // 2 hours (default)
  },
});

// Will automatically refresh if within 5 minutes of expiry
const { data, tokens } = await pc.people.person("123").get();

// Tokens are only returned when they were refreshed
if (tokens) {
  console.log("Token was refreshed!");
  console.log("New access token:", tokens.accessToken);
  console.log("New refresh token:", tokens.refreshToken);
  // Store these and update lastRefreshedAt to Date.now()
}
```

## API Reference

### PlanningCenter

Main client class.

#### Constructor Options

- `auth`: Authentication configuration (required)
  - `type`: `'basic'` or `'bearer'`
  - For basic: `clientId` and `clientSecret`
  - For bearer: `bearerToken`, optional `refreshToken` and `autoRefresh`
- `rateLimitDelay`: Milliseconds between requests (default: 100)
- `maxRetries`: Maximum retries for rate limiting (default: 3)

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
