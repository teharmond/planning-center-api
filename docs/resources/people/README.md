# People App Resources

Documentation for all resources available in the People app.

## Overview

The People app provides access to Planning Center People API, allowing you to manage people, workflows, and related resources.

## Quick Start

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({
  auth: {
    type: 'basic',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret'
  }
});

// Access People app
const people = client.people;
```

## Available Resources

### [Person](./person.md)
Manage individual people records.

```typescript
// Get a person
const person = await client.people.person('123').get();

// Create a person
const newPerson = await client.people.person().create({
  first_name: 'John',
  last_name: 'Doe'
});

// Update a person
await client.people.person('123').update({ first_name: 'Jane' });

// Delete a person
await client.people.person('123').delete();
```

### [People List](./people-list.md)
List and filter people with pagination.

```typescript
// List all people
const people = await client.people.list();

// List with filtering
const admins = await client.people.list({
  filter: 'admins',
  per_page: 50
});
```

### [Workflow](./workflow.md)
Manage workflows and their related resources.

```typescript
// List workflows
const workflows = await client.people.workflow().list();

// Get a workflow
const workflow = await client.people.workflow('123').get();

// Create a workflow
const newWorkflow = await client.people.workflow().create({
  name: 'New Member Onboarding'
});

// Get workflow cards
const cards = await client.people.workflow('123').listCards();

// Get workflow steps
const steps = await client.people.workflow('123').listSteps();
```

### [Workflow Card](./workflow-card.md)
Manage workflow cards (instances) for a person.

```typescript
// List workflow cards for a person
const cards = await client.people.person('123').workflowCards().list();

// Get a specific card
const card = await client.people.person('123').workflowCards().get('456');

// Get card assignee
const assignee = await client.people.person('123')
  .workflowCards()
  .assignee('456')
  .get();
```

### [Workflow Share](./workflow-share.md)
Manage workflow sharing permissions.

```typescript
// List workflow shares for a person
const shares = await client.people.person('123').workflowShares().list();

// Create a workflow share
await client.people.workflow('789').createShare({
  person_id: '123',
  permission: 'edit'
});

// Update a workflow share
await client.people.person('123').workflowShares().update('456', {
  permission: 'view'
});

// Delete a workflow share
await client.people.person('123').workflowShares().delete('456');
```

## Common Patterns

### Pagination

```typescript
const response = await client.people.list({
  per_page: 25,
  offset: 0
});

// Access pagination info
console.log(response.meta.total_count);
console.log(response.links.next);
```

### Including Related Resources

```typescript
const person = await client.people.person('123').get({
  include: ['emails', 'phone_numbers', 'addresses']
});

// Access included data
console.log(person.data.attributes);
```

### Error Handling

```typescript
try {
  const person = await client.people.person('123').get();
} catch (error) {
  console.error('Failed to fetch person:', error.message);
}
```

## API Reference

All resources return `ApiResponse<T>` objects with the following structure:

```typescript
{
  data: T,              // The requested data
  meta?: {              // Metadata about the response
    total_count?: number,
    count?: number,
    next?: { offset?: number },
    can_order_by?: string[],
    can_query_by?: string[],
    can_include?: string[],
    can_filter?: string[]
  },
  links?: {             // Pagination links
    self?: string,
    next?: string,
    prev?: string
  }
}
```

**Note:** When using OAuth with `autoRefresh: true`, token refreshes are handled automatically via the `onTokenRefresh` callback. See the main [README](../../../README.md#token-refresh) for details.

## Resources

- [Person](./person.md) - Individual people management
- [People List](./people-list.md) - List and filter people
- [Workflow](./workflow.md) - Workflow management
- [Workflow Card](./workflow-card.md) - Workflow card instances
- [Workflow Share](./workflow-share.md) - Workflow sharing permissions
