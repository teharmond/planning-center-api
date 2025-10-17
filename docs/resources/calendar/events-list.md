# Events List Resource

The Events List resource allows you to list all calendar events in Planning Center Calendar.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const events = await client.calendar.listEvents(options);
```

## Methods

### `listEvents(options?)`

List all events with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for querying (can_query_by):
  - `approval_status` - Query by approval status
  - `created_at` - Query by creation date
  - `name` - Query by event name
  - `feed_id` - Query by feed ID
  - `percent_approved` - Query by approval percentage
  - `percent_rejected` - Query by rejection percentage
  - `updated_at` - Query by update date
  - `visible_in_church_center` - Query by Church Center visibility
- `options.order` (optional): Sort order (e.g., `'name'`, `'-starts_at'`, `'created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include (can_include):
  - `attachments`, `feed`, `owner`, `tags`
- `options.filter` (optional): Predefined filter (can_filter):
  - `future` - Only future events

**Examples:**

```typescript
// Basic list
const response = await client.calendar.listEvents();

// With pagination
const response = await client.calendar.listEvents({
  per_page: 50,
  offset: 100
});

// Filter for future events
const response = await client.calendar.listEvents({
  filter: 'future'
});

// Query by approval status
const response = await client.calendar.listEvents({
  where: {
    approval_status: 'approved'
  }
});

// Query by Church Center visibility
const response = await client.calendar.listEvents({
  where: {
    visible_in_church_center: true
  }
});

// Query by name
const response = await client.calendar.listEvents({
  where: {
    name: 'Easter Service'
  }
});

// Combine query and filter
const response = await client.calendar.listEvents({
  where: {
    approval_status: 'approved',
    visible_in_church_center: true
  },
  filter: 'future',
  order: 'starts_at'
});

// With includes
const response = await client.calendar.listEvents({
  include: 'attachments,feed,owner,tags',
  filter: 'future'
});

// Order by start date
const response = await client.calendar.listEvents({
  order: 'starts_at',
  filter: 'future',
  per_page: 100
});
```

## Response

Returns an `ApiResponse<Event[]>` with:
- `data`: Array of event objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
  - `can_order_by`: Available fields for ordering
  - `can_query_by`: Available fields for querying
  - `can_include`: Available resources for inclusion
  - `can_filter`: Available predefined filters
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## Event Object

Each event object contains:
- `id`: Unique identifier
- `type`: "Event"
- `attributes`:
  - `name`: Event name
  - `description`: Event description
  - `approval_status`: Current approval status
  - `created_at`: Creation date
  - `updated_at`: Last update date
  - `percent_approved`: Percentage approved
  - `percent_rejected`: Percentage rejected
  - `visible_in_church_center`: Whether visible on Church Center
  - `image_url`: Event image URL
  - `starts_at`: Event start date/time
  - `ends_at`: Event end date/time

## API Endpoints

- `GET /calendar/v2/events`

## Query Parameter Examples

```
# Filter for future events
GET /calendar/v2/events?filter=future

# Query by approval status
GET /calendar/v2/events?where[approval_status]=approved

# Query by Church Center visibility
GET /calendar/v2/events?where[visible_in_church_center]=true

# Query by name
GET /calendar/v2/events?where[name]=Easter%20Service

# Combine query and filter with ordering
GET /calendar/v2/events?filter=future&where[approval_status]=approved&order=starts_at

# With includes
GET /calendar/v2/events?filter=future&include=attachments,tags,owner
```
