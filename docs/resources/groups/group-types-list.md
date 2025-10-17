# Group Types List Resource

The Group Types List resource allows you to list all group types in Planning Center Groups.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const groupTypes = await client.groups.listGroupTypes(options);
```

## Methods

### `listGroupTypes(options?)`

List all group types with optional pagination and ordering.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.order` (optional): Sort order (e.g., `'name'`, `'position'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list
const response = await client.groups.listGroupTypes();

// With pagination
const response = await client.groups.listGroupTypes({
  per_page: 50,
  offset: 100
});

// With ordering
const response = await client.groups.listGroupTypes({
  order: 'position'
});

// With includes
const response = await client.groups.listGroupTypes({
  include: 'groups'
});
```

## Response

Returns an `ApiResponse<GroupType[]>` with:
- `data`: Array of group type objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## GroupType Object

Each group type object contains:
- `id`: Unique identifier
- `type`: "GroupType"
- `attributes`:
  - `name`: Group type name
  - `description`: Group type description
  - `church_center_visible`: Whether visible on Church Center
  - `position`: Sort position
  - `color`: Color hex code for UI display

## API Endpoints

- `GET /groups/v2/group_types`
