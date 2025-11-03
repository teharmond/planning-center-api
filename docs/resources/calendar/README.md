# Calendar Resources

Documentation for Planning Center Calendar API resources.

## Available Resources

- [Events List](./events-list.md) - List and filter calendar events
- [Event Instances List](./event-instances-list.md) - List and filter calendar event instances
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

// List event instances
const eventInstances = await client.calendar.listEventInstances();

// List future event instances
const eventInstances = await client.calendar.listEventInstances({
  filter: 'future',
  order: 'starts_at'
});

// Query event instances by event name
const eventInstances = await client.calendar.listEventInstances({
  where: {
    event_name: 'Sunday Service'
  },
  include: 'event,tags'
});
```

## Base URL

```
https://api.planningcenteronline.com/calendar/v2
```
