# Categories List Resource

The Categories List resource allows you to list all event categories in Planning Center Registrations.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const categories = await client.registrations.listCategories(options);
```

## Methods

### `listCategories(options?)`

List all categories with optional pagination and ordering.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.order` (optional): Sort order (e.g., `'name'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list
const response = await client.registrations.listCategories();

// With pagination
const response = await client.registrations.listCategories({
  per_page: 50,
  offset: 100
});

// With ordering
const response = await client.registrations.listCategories({
  order: 'name'
});

// With includes
const response = await client.registrations.listCategories({
  include: 'signups'
});
```

## Response

Returns an `ApiResponse<Category[]>` with:
- `data`: Array of category objects
- `meta`: Pagination and metadata
- `links`: Pagination links

## Category Object

Each category object contains:
- `id`: Unique identifier
- `type`: "Category"
- `attributes`:
  - `name`: Category name
  - `description`: Category description
  - `created_at`: Creation date
  - `updated_at`: Last update date

## API Endpoints

- `GET /registrations/v2/categories`
