# Publishing Resources

Documentation for Planning Center Publishing API resources.

## Available Resources

- [Episodes List](./episodes-list.md) - List all episodes
- [Series List](./series-list.md) - List all series
- [Channel Episodes List](./channel-episodes-list.md) - List episodes by channel

## Overview

The Publishing app in Planning Center helps churches manage and distribute their sermon content, videos, and podcasts.

## Common Use Cases

1. **List all episodes**
   ```typescript
   const episodes = await client.publishing.listEpisodes();
   ```

2. **List episodes by series**
   ```typescript
   const episodes = await client.publishing.listEpisodes({
     where: { series_id: 12345 }
   });
   ```

3. **List published episodes**
   ```typescript
   const episodes = await client.publishing.listEpisodes({
     where: { published_to_church_center: true }
   });
   ```

4. **List all series**
   ```typescript
   const series = await client.publishing.listSeries();
   ```

5. **List episodes for a specific channel**
   ```typescript
   const episodes = await client.publishing.listChannelEpisodes('channel-id');
   ```

## Base URL

All Publishing API endpoints are under:
```
https://api.planningcenteronline.com/publishing/v2
```
