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
- `options.where` (optional): Object with key-value pairs for filtering
  - `series_id`: Filter by series ID
  - `published_to_church_center`: Filter by Church Center publication status (boolean)
- `options.order` (optional): Sort order (e.g., `'title'`, `'-published_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list
const response = await client.publishing.listEpisodes();

// With pagination
const response = await client.publishing.listEpisodes({
  per_page: 50,
  offset: 100
});

// Filter by series
const response = await client.publishing.listEpisodes({
  where: {
    series_id: 12345
  }
});

// Filter by Church Center publication status
const response = await client.publishing.listEpisodes({
  where: {
    published_to_church_center: true
  }
});

// Combine filters
const response = await client.publishing.listEpisodes({
  where: {
    series_id: 12345,
    published_to_church_center: true
  },
  order: '-published_at',
  per_page: 50
});

// With includes
const response = await client.publishing.listEpisodes({
  include: 'series,channel'
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
# Filter by series
GET /publishing/v2/episodes?where[series_id]=12345

# Filter by Church Center publication
GET /publishing/v2/episodes?where[published_to_church_center]=true

# Combine filters
GET /publishing/v2/episodes?where[series_id]=12345&where[published_to_church_center]=true&order=-published_at
```
