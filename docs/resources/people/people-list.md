# People List Resource

The People List resource allows you to list and filter people in Planning Center People.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const people = await client.people.list(options);
```

## Methods

### `list(options?)`

List all people with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 100, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for filtering
- `options.order` (optional): Sort order (e.g., `'last_name'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include
- `options.filter` (optional): Predefined filter name:
  - `created_since`
  - `admins`
  - `organization_admins`
  - Or custom filter string

**Example:**
```typescript
// Basic list
const response = await client.people.list();

// With pagination
const response = await client.people.list({
  per_page: 50,
  offset: 100
});

// With filtering
const response = await client.people.list({
  where: {
    first_name: 'John'
  },
  order: 'last_name'
});

// With includes
const response = await client.people.list({
  include: 'emails,phone_numbers'
});

// With predefined filter
const response = await client.people.list({
  filter: 'admins'
});
```

## Response

Returns an `ApiResponse<Person[]>` with:
- `data`: Array of person objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## API Endpoints

- `GET /people/v2/people`
