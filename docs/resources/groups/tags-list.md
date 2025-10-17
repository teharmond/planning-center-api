# Tags List Resource

The Tags List resource allows you to list all tags in Planning Center Groups.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const tags = await client.groups.listTags(options);
```

## Methods

### `listTags(options?)`

List all tags with optional pagination and ordering.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.order` (optional): Sort order (e.g., `'name'`, `'position'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list
const response = await client.groups.listTags();

// With pagination
const response = await client.groups.listTags({
  per_page: 50,
  offset: 100
});

// With ordering
const response = await client.groups.listTags({
  order: 'position'
});

// With includes
const response = await client.groups.listTags({
  include: 'groups'
});
```

## Response

Returns an `ApiResponse<Tag[]>` with:
- `data`: Array of tag objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## Tag Object

Each tag object contains:
- `id`: Unique identifier
- `type`: "Tag"
- `attributes`:
  - `name`: Tag name
  - `position`: Sort position

## API Endpoints

- `GET /groups/v2/tags`
