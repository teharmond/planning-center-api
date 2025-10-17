# Calendar Resources

Documentation for Planning Center Calendar API resources.

## Available Resources

- [Events List](./events-list.md) - List and filter calendar events
- [Tags List](./tags-list.md) - List calendar tags

## Common Use Cases

```typescript
// List all events
const events = await client.calendar.listEvents();

// List future events
const events = await client.calendar.listEvents({
  filter: 'future'
});

// Filter by approval status
const events = await client.calendar.listEvents({
  where: {
    approval_status: 'approved'
  }
});

// Filter by church center visibility
const events = await client.calendar.listEvents({
  where: {
    visible_in_church_center: true
  }
});

// With includes
const events = await client.calendar.listEvents({
  include: 'attachments,feed,owner,tags'
});

// List tags
const tags = await client.calendar.listTags();
```

## Base URL

```
https://api.planningcenteronline.com/calendar/v2
```
