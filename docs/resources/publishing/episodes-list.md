# Episodes List Resource

The Episodes List resource allows you to list all episodes in Planning Center Publishing.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const episodes = await client.publishing.listEpisodes(options);
```

## Methods

### `listEpisodes(options?)`

List all episodes with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for querying (can_query_by):
  - `search` - Search episodes
  - `series_id` - Query by series ID
  - `services_plan_remote_identifier` - Query by Services plan remote identifier
  - `services_service_type_remote_identifier` - Query by Services service type remote identifier
- `options.order` (optional): Sort order (e.g., `'title'`, `'-published_at'`)
- `options.include` (optional): Comma-separated string of related resources to include (can_include):
  - `channel`, `episode_resources`, `episode_times`, `series`, `speakerships`
- `options.filter` (optional): Predefined filter name (can_filter):
  - `published_live` - Published live episodes
  - `not_published_live` - Not published live
  - `connected_to_services` - Connected to Services
  - `not_connected_to_services` - Not connected to Services
  - `published_on_church_center` - Published on Church Center

**Examples:**

```typescript
// Basic list
const response = await client.publishing.listEpisodes();

// With pagination
const response = await client.publishing.listEpisodes({
  per_page: 50,
  offset: 100
});

// Query by series ID
const response = await client.publishing.listEpisodes({
  where: {
    series_id: 12345
  }
});

// Search episodes
const response = await client.publishing.listEpisodes({
  where: {
    search: 'Easter'
  }
});

// Filter by Church Center publication
const response = await client.publishing.listEpisodes({
  filter: 'published_on_church_center'
});

// Filter for published live episodes
const response = await client.publishing.listEpisodes({
  filter: 'published_live'
});

// Filter for episodes connected to Services
const response = await client.publishing.listEpisodes({
  filter: 'connected_to_services'
});

// Combine query and filter
const response = await client.publishing.listEpisodes({
  where: {
    series_id: 12345
  },
  filter: 'published_on_church_center',
  order: '-published_at',
  per_page: 50
});

// With includes
const response = await client.publishing.listEpisodes({
  include: 'series,channel,episode_resources,speakerships'
});
```

## Response

Returns an `ApiResponse<Episode[]>` with:
- `data`: Array of episode objects
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `next.offset`: Offset for next page
- `links`: Pagination links
  - `self`: Current page URL
  - `next`: Next page URL
  - `prev`: Previous page URL

## Episode Object

Each episode object contains:
- `id`: Unique identifier
- `type`: "Episode"
- `attributes`:
  - `title`: Episode title
  - `description`: Episode description
  - `published_at`: Publication date
  - `created_at`: Creation date
  - `updated_at`: Last update date
  - `image_url`: Episode image URL
  - `duration`: Duration in seconds
  - `video_url`: Video URL (if applicable)
  - `audio_url`: Audio URL (if applicable)
  - `church_center_published`: Whether published to Church Center

## API Endpoints

- `GET /publishing/v2/episodes`

## Query Parameter Examples

```
# Query by series ID
GET /publishing/v2/episodes?where[series_id]=12345

# Search episodes
GET /publishing/v2/episodes?where[search]=Easter

# Filter by Church Center publication
GET /publishing/v2/episodes?filter=published_on_church_center

# Filter for published live episodes
GET /publishing/v2/episodes?filter=published_live

# Combine query and filter
GET /publishing/v2/episodes?where[series_id]=12345&filter=published_on_church_center&order=-published_at
```
