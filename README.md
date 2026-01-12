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

## Including Related Resources

When fetching data, you can include related resources using the `include` option. The included resources are returned in the `included` array of the response:

```typescript
// Fetch workflow cards with related resources
const response = await pc.people.workflow('123').listCards({
  include: 'assignee,current_step,person,workflow'
});

// Access the main data
console.log(response.data); // Array of workflow cards

// Access included resources
console.log(response.included); // Array of related Person, WorkflowStep, Workflow objects

// Find a specific included resource
const assignee = response.included?.find(
  item => item.type === 'Person' && item.id === '456'
);
```

The `included` array contains all related resources requested via the `include` parameter. Each resource has `type`, `id`, `attributes`, and optionally `relationships` and `links`.

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

### Home App

Access the Home app via `pc.home`.

> **Important:** The Home API only supports Personal Access Token (basic) authentication, not OAuth.

#### listTasks(options?)

List tasks for the current user.

```typescript
// Get all tasks
const { data } = await pc.home.listTasks();

// Get incomplete tasks
const { data } = await pc.home.listTasks({
  filter: "incomplete",
});

// Search tasks by title
const { data } = await pc.home.listTasks({
  where: { search_title: "meeting" },
});

// Get tasks due today with related data
const { data, included } = await pc.home.listTasks({
  filter: "due_today",
  include: ["assignee", "task_list"],
  order: "due_at",
});
```

**List Options:**

| Option | Type | Description |
|--------|------|-------------|
| `per_page` | `number` | Results per page (1-100, default: 25) |
| `offset` | `number` | Pagination offset |
| `where` | `object` | Query filters (`search_title`) |
| `order` | `string` | Sort by: `title`, `position`, `due_at` (prefix with `-` for descending) |
| `include` | `string \| string[]` | Include related resources: `assignee`, `created_by`, `repeating_task`, `task_list` |
| `filter` | `string \| string[]` | Predefined filters: `incomplete`, `complete`, `incomplete_or_completed_today`, `incomplete_or_completed_last_7_days`, `due_today`, `upcoming` |
| `autoPaginate` | `boolean` | Override auto-pagination setting |

#### task(id?: string)

Returns a HomeTaskResource for CRUD operations.

```typescript
// Get a task
const { data } = await pc.home.task("123").get();

// Get a task with related data
const { data, included } = await pc.home.task("123").get({
  include: ["task_list", "created_by"],
});

// Create a task
const { data } = await pc.home.task().create({
  title: "Follow up with team",
  description: "<div>Discuss project timeline</div>",
  due_at: "2025-01-15",
  task_list_id: "456",
});

// Update a task
await pc.home.task("123").update({
  title: "Updated title",
  status: "complete",
});

// Delete a task
await pc.home.task("123").delete();
```

### HomeTaskResource

Methods available on a task resource:

- `get(options?)`: Get task by ID
  - `options.include`: Include related resources (`assignee`, `created_by`, `repeating_task`, `task_list`)
- `create(attributes)`: Create a new task
  - Required: `title`
  - Optional: `description`, `due_at`, `status`, `associated_url`, `task_list_id`
- `update(attributes)`: Update a task
  - Optional: `title`, `description`, `due_at`, `status`, `position`, `associated_url`
- `delete()`: Delete a task

#### listTaskLists(options?)

List task lists for the current user.

```typescript
// Get all task lists
const { data } = await pc.home.listTaskLists();

// Get standard (non-archived) task lists
const { data } = await pc.home.listTaskLists({
  filter: "standard",
});

// Search task lists by title
const { data } = await pc.home.listTaskLists({
  where: { search_title: "Project" },
});

// Get task lists with collaborators
const { data, included } = await pc.home.listTaskLists({
  include: ["collaborators", "created_by"],
});
```

**List Task Lists Options:**

| Option | Type | Description |
|--------|------|-------------|
| `per_page` | `number` | Results per page (1-100, default: 25) |
| `offset` | `number` | Pagination offset |
| `where` | `object` | Query filters (`id`, `search_title`) |
| `order` | `string` | Sort by: `position`, `archived_at`, `updated_at` (prefix with `-` for descending) |
| `include` | `string \| string[]` | Include related resources: `collaborators`, `created_by` |
| `filter` | `string \| string[]` | Predefined filters: `archived`, `standard` |
| `autoPaginate` | `boolean` | Override auto-pagination setting |

#### taskList(id?: string)

Returns a HomeTaskListResource for CRUD operations.

```typescript
// Get a task list
const { data } = await pc.home.taskList("456").get();

// Get a task list with includes
const { data, included } = await pc.home.taskList("456").get({
  include: ["collaborators", "created_by"],
});

// Create a task list
const { data } = await pc.home.taskList().create({
  title: "New Project",
  color_name: "blue-base",
});

// Update a task list
await pc.home.taskList("456").update({
  title: "Updated Project Name",
});

// Delete a task list
await pc.home.taskList("456").delete();

// List tasks in a task list
const { data } = await pc.home.taskList("456").listTasks({
  filter: "incomplete",
});

// List collaborators for a task list
const { data } = await pc.home.taskList("456").listCollaborators();
```

### HomeTaskListResource

Methods available on a task list resource:

- `get(options?)`: Get task list by ID
  - `options.include`: Include related resources (`collaborators`, `created_by`)
- `create(attributes)`: Create a new task list
  - Required: `title`
  - Optional: `color_name`
- `update(attributes)`: Update a task list
  - Optional: `title`, `color_name`, `position`
- `delete()`: Delete a task list
- `listTasks(options?)`: List tasks in this task list
  - Supports same options as `listTasks()` plus additional filters: `completed_today`, `completed_this_week`, `completed_last_7_days`, `due_this_week`, `incomplete_or_completed`
- `listCollaborators(options?)`: List collaborators for this task list
  - `options.per_page`: Results per page (1-100)
  - `options.offset`: Pagination offset

## License

MIT
