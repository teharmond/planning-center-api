# Channel Episodes List Resource

The Channel Episodes List resource allows you to list episodes within a specific channel in Planning Center Publishing.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const episodes = await client.publishing.listChannelEpisodes(channelId, options);
```

## Methods

### `listChannelEpisodes(channelId, options?)`

List all episodes for a specific channel with optional filtering and pagination.

**Parameters:**
- `channelId` (required): The ID of the channel
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for filtering
  - `series_id`: Filter by series ID
  - `published_to_church_center`: Filter by Church Center publication status (boolean)
- `options.order` (optional): Sort order (e.g., `'title'`, `'-published_at'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Examples:**

```typescript
// Basic list for a channel
const response = await client.publishing.listChannelEpisodes('12345');

// With pagination
const response = await client.publishing.listChannelEpisodes('12345', {
  per_page: 50,
  offset: 100
});

// Filter by series
const response = await client.publishing.listChannelEpisodes('12345', {
  where: {
    series_id: 67890
  }
});

// Filter by Church Center publication
const response = await client.publishing.listChannelEpisodes('12345', {
  where: {
    published_to_church_center: true
  }
});

// Combine filters
const response = await client.publishing.listChannelEpisodes('12345', {
  where: {
    series_id: 67890,
    published_to_church_center: true
  },
  order: '-published_at'
});
```

## Response

Returns an `ApiResponse<Episode[]>` with:
- `data`: Array of episode objects
- `meta`: Pagination and metadata
- `links`: Pagination links

## Episode Object

Same structure as the [Episodes List](./episodes-list.md#episode-object) resource.

## API Endpoints

- `GET /publishing/v2/channels/{channel_id}/episodes`
