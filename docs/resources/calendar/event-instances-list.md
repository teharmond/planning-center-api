# Event Instances List Resource

The Event Instances List resource allows you to list all calendar event instances in Planning Center Calendar.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const eventInstances = await client.calendar.listEventInstances(options);
```

## Methods

### `listEventInstances(options?)`

List all event instances with optional filtering, querying, ordering, and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for querying (can_query_by):
  - `created_at` - Query by creation date
  - `ends_at` - Query by end date/time
  - `event_name` - Query by event name
  - `starts_at` - Query by start date/time
  - `tag_ids` - Query by tag IDs
  - `updated_at` - Query by update date
- `options.order` (optional): Sort order (can_order_by):
  - `created_at`, `updated_at`, `starts_at`, `ends_at`
  - Prefix with `-` for descending order (e.g., `'-starts_at'`)
- `options.include` (optional): Comma-separated string of related resources to include (can_include):
  - `event`, `event_times`, `resource_bookings`, `tags`
- `options.filter` (optional): Predefined filter (can_filter):
  - `future` - Only future event instances
  - `not_pending_event_requests` - Exclude pending event requests
  - `all` - All event instances
  - `approver` - Instances where user is approver
  - `approver_subscriber` - Instances where user is approver or subscriber
  - `manager` - Instances where user is manager
  - `manager_approver` - Instances where user is manager or approver
  - `manager_approver_subscriber` - Instances where user is manager, approver, or subscriber
  - `manager_subscriber` - Instances where user is manager or subscriber
  - `owner` - Instances where user is owner
  - `owner_approver` - Instances where user is owner or approver
  - `owner_approver_subscriber` - Instances where user is owner, approver, or subscriber
  - `owner_manager_approver` - Instances where user is owner, manager, or approver
  - `owner_manager_subscriber` - Instances where user is owner, manager, or subscriber
  - `owner_manager_approver_subscriber` - Instances where user is owner, manager, approver, or subscriber
  - `owner_manager` - Instances where user is owner or manager
  - `owner_subscriber` - Instances where user is owner or subscriber
  - `subscriber` - Instances where user is subscriber
  - `approved` - Only approved instances
  - `pending` - Only pending instances
  - `rejected` - Only rejected instances
  - `unresolved` - Only unresolved instances
  - `lost` - Only lost instances
  - `shared` - Only shared instances
  - `approved_pending` - Approved or pending instances
  - `approved_rejected` - Approved or rejected instances
  - `pending_rejected` - Pending or rejected instances
  - `approved_pending_rejected` - Approved, pending, or rejected instances

**Examples:**

```typescript
// Basic list
const response = await client.calendar.listEventInstances();

// With pagination
const response = await client.calendar.listEventInstances({
  per_page: 50,
  offset: 100
});

// Filter for future event instances
const response = await client.calendar.listEventInstances({
  filter: 'future'
});

// Query by event name
const response = await client.calendar.listEventInstances({
  where: {
    event_name: 'Sunday Service'
  }
});

// Query by date range
const response = await client.calendar.listEventInstances({
  where: {
    starts_at: '2025-01-01',
    ends_at: '2025-12-31'
  }
});

// Query by tag IDs
const response = await client.calendar.listEventInstances({
  where: {
    tag_ids: '12345,67890'
  }
});

// Combine query and filter
const response = await client.calendar.listEventInstances({
  where: {
    event_name: 'Sunday Service',
    starts_at: '2025-01-01'
  },
  filter: 'approved',
  order: 'starts_at'
});

// With includes
const response = await client.calendar.listEventInstances({
  include: 'event,event_times,resource_bookings,tags',
  filter: 'future'
});

// Order by start date (descending)
const response = await client.calendar.listEventInstances({
  order: '-starts_at',
  filter: 'future',
  per_page: 100
});

// Filter by approval status
const response = await client.calendar.listEventInstances({
  filter: 'approved_pending',
  order: 'starts_at'
});

// Filter by user role
const response = await client.calendar.listEventInstances({
  filter: 'owner_manager_approver',
  include: 'event,tags'
});
```

## Response

Returns an `ApiResponse<EventInstance[]>` with:
- `data`: Array of event instance objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
  - `can_order_by`: Available fields for ordering (`created_at`, `updated_at`, `starts_at`, `ends_at`)
  - `can_query_by`: Available fields for querying (`created_at`, `ends_at`, `event_name`, `starts_at`, `tag_ids`, `updated_at`)
  - `can_include`: Available resources for inclusion (`event`, `event_times`, `resource_bookings`, `tags`)
  - `can_filter`: Available predefined filters
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## EventInstance Object

Each event instance object contains:
- `id`: Unique identifier
- `type`: "EventInstance"
- `attributes`:
  - `starts_at`: Instance start date/time
  - `ends_at`: Instance end date/time
  - `all_day`: Whether this is an all-day event
  - `location`: Location of the instance
  - `notes`: Instance notes
  - `approval_status`: Current approval status
  - `created_at`: Creation date
  - `updated_at`: Last update date

## API Endpoints

- `GET /calendar/v2/event_instances`

## Query Parameter Examples

```
# Filter for future event instances
GET /calendar/v2/event_instances?filter=future

# Query by event name
GET /calendar/v2/event_instances?where[event_name]=Sunday%20Service

# Query by date range
GET /calendar/v2/event_instances?where[starts_at]=2025-01-01&where[ends_at]=2025-12-31

# Query by tag IDs
GET /calendar/v2/event_instances?where[tag_ids]=12345,67890

# Combine query and filter with ordering
GET /calendar/v2/event_instances?filter=approved&where[event_name]=Sunday%20Service&order=starts_at

# With includes
GET /calendar/v2/event_instances?filter=future&include=event,event_times,resource_bookings,tags

# Filter by approval status
GET /calendar/v2/event_instances?filter=approved_pending&order=starts_at

# Filter by user role with includes
GET /calendar/v2/event_instances?filter=owner_manager_approver&include=event,tags
```
