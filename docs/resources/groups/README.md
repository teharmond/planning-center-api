# Groups Resources

Documentation for Planning Center Groups API resources.

## Available Resources

- [Groups List](./groups-list.md) - List and filter groups

## Overview

The Groups app in Planning Center helps churches organize and manage their small groups, connect groups, and community groups.

## Common Use Cases

1. **List all active groups**
   ```typescript
   const groups = await client.groups.list({
     where: { archive_status: 'not_archived' }
   });
   ```

2. **Find groups by type**
   ```typescript
   const groups = await client.groups.list({
     filter: { group_type: [491331, 491423] }
   });
   ```

3. **Find groups by campus**
   ```typescript
   const groups = await client.groups.list({
     filter: { campus: [1, 2, 3] }
   });
   ```

## Base URL

All Groups API endpoints are under:
```
https://api.planningcenteronline.com/groups/v2
```
