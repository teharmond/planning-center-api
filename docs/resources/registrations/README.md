# Registrations Resources

Documentation for Planning Center Registrations API resources.

## Available Resources

- Signups List - List and filter signups/events
- Categories List - List event categories
- Campuses List - List campuses

## Common Use Cases

```typescript
// List all signups
const signups = await client.registrations.listSignups();

// List published signups
const signups = await client.registrations.listSignups({
  filter: 'published'
});

// List active signups
const signups = await client.registrations.listSignups({
  filter: 'active'
});

// List categories
const categories = await client.registrations.listCategories();

// List campuses
const campuses = await client.registrations.listCampuses();
```

## Base URL

```
https://api.planningcenteronline.com/registrations/v2
```
