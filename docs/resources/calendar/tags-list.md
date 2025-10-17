# Tags List Resource

The Tags List resource allows you to list all tags in Planning Center Calendar.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const tags = await client.calendar.listTags(options);
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
const response = await client.calendar.listTags();

// With pagination
const response = await client.calendar.listTags({
  per_page: 50,
  offset: 100
});

// With ordering by position
const response = await client.calendar.listTags({
  order: 'position'
});

// With ordering by name
const response = await client.calendar.listTags({
  order: 'name'
});

// With includes
const response = await client.calendar.listTags({
  include: 'events'
});
```

## Response

Returns an `ApiResponse<CalendarTag[]>` with:
- `data`: Array of tag objects
- `meta`: Pagination and metadata
- `links`: Pagination links

## Tag Object

Each tag object contains:
- `id`: Unique identifier
- `type`: "Tag"
- `attributes`:
  - `name`: Tag name
  - `color`: Tag color (hex code)
  - `created_at`: Creation date
  - `updated_at`: Last update date
  - `position`: Sort position

## API Endpoints

- `GET /calendar/v2/tags`

## Query Parameter Examples

```
# Order by position
GET /calendar/v2/tags?order=position

# Order by name
GET /calendar/v2/tags?order=name
```
