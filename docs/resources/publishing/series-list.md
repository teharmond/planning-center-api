# Series List Resource

The Series List resource allows you to list all series in Planning Center Publishing.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const series = await client.publishing.listSeries(options);
```

## Methods

### `listSeries(options?)`

List all series with optional pagination and ordering.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.order` (optional): Sort order (e.g., `'title'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list
const response = await client.publishing.listSeries();

// With pagination
const response = await client.publishing.listSeries({
  per_page: 50,
  offset: 100
});

// With ordering
const response = await client.publishing.listSeries({
  order: '-created_at'
});

// With includes
const response = await client.publishing.listSeries({
  include: 'episodes'
});
```

## Response

Returns an `ApiResponse<Series[]>` with:
- `data`: Array of series objects
- `meta`: Pagination and metadata
- `links`: Pagination links

## Series Object

Each series object contains:
- `id`: Unique identifier
- `type`: "Series"
- `attributes`:
  - `title`: Series title
  - `description`: Series description
  - `image_url`: Series image URL
  - `created_at`: Creation date
  - `updated_at`: Last update date

## API Endpoints

- `GET /publishing/v2/series`
