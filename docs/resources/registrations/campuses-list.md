# Campuses List Resource

The Campuses List resource allows you to list all campuses in Planning Center Registrations.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const campuses = await client.registrations.listCampuses(options);
```

## Methods

### `listCampuses(options?)`

List all campuses with optional pagination and ordering.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.order` (optional): Sort order (e.g., `'name'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list
const response = await client.registrations.listCampuses();

// With pagination
const response = await client.registrations.listCampuses({
  per_page: 50,
  offset: 100
});

// With ordering
const response = await client.registrations.listCampuses({
  order: 'name'
});

// With includes
const response = await client.registrations.listCampuses({
  include: 'signups'
});
```

## Response

Returns an `ApiResponse<RegistrationsCampus[]>` with:
- `data`: Array of campus objects
- `meta`: Pagination and metadata
- `links`: Pagination links

## Campus Object

Each campus object contains:
- `id`: Unique identifier
- `type`: "Campus"
- `attributes`:
  - `name`: Campus name
  - `description`: Campus description
  - `created_at`: Creation date
  - `updated_at`: Last update date

## API Endpoints

- `GET /registrations/v2/campuses`
