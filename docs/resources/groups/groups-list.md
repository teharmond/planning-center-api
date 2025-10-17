# Groups List Resource

The Groups List resource allows you to list and filter groups in Planning Center Groups.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const groups = await client.groups.list(options);
```

## Methods

### `list(options?)`

List all groups with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for filtering
  - `archive_status`: Archive status filter
    - `"not_archived"`: Only active groups (default)
    - `"only"`: Only archived groups
    - `"include"`: Both active and archived groups
- `options.order` (optional): Sort order (e.g., `'name'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include
- `options.filter` (optional): Object with filter criteria:
  - `group_type`: Array of group type IDs to filter by
  - `campus`: Array of campus IDs to filter by

**Examples:**

```typescript
// Basic list
const response = await client.groups.list();

// With pagination
const response = await client.groups.list({
  per_page: 50,
  offset: 100
});

// Filter by archive status
const response = await client.groups.list({
  where: {
    archive_status: 'not_archived'
  }
});

// Filter by group types
const response = await client.groups.list({
  filter: {
    group_type: [491331, 491423]
  }
});

// Filter by campus
const response = await client.groups.list({
  filter: {
    campus: [1, 2, 3]
  }
});

// Combine filters
const response = await client.groups.list({
  where: {
    archive_status: 'not_archived'
  },
  filter: {
    group_type: [491331],
    campus: [1, 2]
  },
  order: 'name',
  per_page: 50
});

// With includes
const response = await client.groups.list({
  include: 'group_type,location'
});
```

## Response

Returns an `ApiResponse<Group[]>` with:
- `data`: Array of group objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## Group Object

Each group object contains:
- `id`: Unique identifier
- `type`: "Group"
- `attributes`:
  - `archived_at`: Date group was archived (if applicable)
  - `contact_email`: Contact email for the group
  - `created_at`: Date group was created
  - `description`: Group description
  - `enrollment_open`: Whether enrollment is open
  - `enrollment_strategy`: How enrollment is handled
  - `events_visibility`: Event visibility setting
  - `location_type_preference`: Preferred location type
  - `memberships_count`: Number of members
  - `name`: Group name
  - `public_church_center_web_url`: Public URL for the group
  - `schedule`: Group meeting schedule
  - `virtual_location_url`: Virtual meeting URL

## API Endpoints

- `GET /groups/v2/groups`

## Query Parameter Examples

```
# Filter by archive status
GET /groups/v2/groups?where[archive_status]=not_archived

# Filter by group type
GET /groups/v2/groups?filter=group_type&group_type_id=491331,491423

# Filter by campus
GET /groups/v2/groups?filter=campus&campus_id=1,2,3

# Combine multiple filters
GET /groups/v2/groups?where[archive_status]=not_archived&filter=group_type&group_type_id=491331&filter=campus&campus_id=1,2
```
