# Campuses List Resource

The Campuses List resource allows you to list all campuses in Planning Center Groups.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const campuses = await client.groups.listCampuses(options);
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
const response = await client.groups.listCampuses();

// With pagination
const response = await client.groups.listCampuses({
  per_page: 50,
  offset: 100
});

// With ordering
const response = await client.groups.listCampuses({
  order: 'name'
});

// With includes
const response = await client.groups.listCampuses({
  include: 'groups'
});
```

## Response

Returns an `ApiResponse<Campus[]>` with:
- `data`: Array of campus objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## Campus Object

Each campus object contains:
- `id`: Unique identifier
- `type`: "Campus"
- `attributes`:
  - `name`: Campus name
  - `description`: Campus description
  - `time_zone`: Time zone identifier
  - `latitude`: Geographic latitude
  - `longitude`: Geographic longitude
  - `street`: Street address
  - `city`: City
  - `state`: State/province
  - `zip`: Postal code
  - `country`: Country
  - `phone_number`: Contact phone number
  - `website`: Campus website URL
  - `avatar_url`: Campus image/logo URL

## API Endpoints

- `GET /groups/v2/campuses`
