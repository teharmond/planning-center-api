# Signups List Resource

The Signups List resource allows you to list all signups/events in Planning Center Registrations.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const signups = await client.registrations.listSignups(options);
```

## Methods

### `listSignups(options?)`

List all signups with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for querying (can_query_by):
  - `campuses` - Query by campus
  - `categories` - Query by category
  - `id` - Query by ID
  - `name` - Query by name
- `options.order` (optional): Sort order (e.g., `'name'`, `'-created_at'`, `'starts_at'`)
- `options.include` (optional): Comma-separated string of related resources to include
- `options.filter` (optional): Predefined filter name (can_filter):
  - `between` - Filter signups between date ranges
  - `published` - Only published signups
  - `unarchived` - Only unarchived signups
  - `future` - Only future signups
  - `with_event_times` - Signups with event times
  - `active` - Active signups only
  - `listed` - Listed signups only
  - `detailed` - Detailed view of signups

**Examples:**

```typescript
// Basic list
const response = await client.registrations.listSignups();

// With pagination
const response = await client.registrations.listSignups({
  per_page: 50,
  offset: 100
});

// Filter for published signups
const response = await client.registrations.listSignups({
  filter: 'published'
});

// Filter for active signups
const response = await client.registrations.listSignups({
  filter: 'active'
});

// Filter for future signups
const response = await client.registrations.listSignups({
  filter: 'future'
});

// Filter for unarchived signups
const response = await client.registrations.listSignups({
  filter: 'unarchived'
});

// Query by name
const response = await client.registrations.listSignups({
  where: {
    name: 'Summer Camp'
  }
});

// Query by ID
const response = await client.registrations.listSignups({
  where: {
    id: '12345'
  }
});

// With ordering
const response = await client.registrations.listSignups({
  order: '-starts_at',
  filter: 'future'
});

// With includes
const response = await client.registrations.listSignups({
  include: 'event_times,category'
});
```

## Response

Returns an `ApiResponse<Signup[]>` with:
- `data`: Array of signup objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## Signup Object

Each signup object contains:
- `id`: Unique identifier
- `type`: "Signup"
- `attributes`:
  - `name`: Signup name
  - `description`: Signup description
  - `image_url`: Signup image URL
  - `starts_at`: Start date/time
  - `ends_at`: End date/time
  - `created_at`: Creation date
  - `updated_at`: Last update date
  - `archived_at`: Archive date (if archived)
  - `published_at`: Publication date
  - `listed`: Whether the signup is listed
  - `active`: Whether the signup is active

## API Endpoints

- `GET /registrations/v2/signups`

## Query Parameter Examples

```
# Filter for published signups
GET /registrations/v2/signups?filter=published

# Filter for active signups
GET /registrations/v2/signups?filter=active

# Filter for future signups
GET /registrations/v2/signups?filter=future

# Query by name
GET /registrations/v2/signups?where[name]=Summer%20Camp

# Combine filters and ordering
GET /registrations/v2/signups?filter=future&order=-starts_at&per_page=50
```
