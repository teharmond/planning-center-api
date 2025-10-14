# Workflow Share Resource

The Workflow Share resource allows you to manage workflow sharing permissions for a specific person.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const workflowShares = client.people.person('123').workflowShares();
```

## Methods

### `list()`

List all workflow shares for a person.

**Example:**
```typescript
const response = await client.people.person('123').workflowShares().list();
console.log(response.data);
```

### `get(workflowShareId)`

Get a specific workflow share by ID.

**Parameters:**
- `workflowShareId`: The ID of the workflow share

**Example:**
```typescript
const response = await client.people.person('123').workflowShares().get('456');
console.log(response.data);
```

### `update(workflowShareId, attributes)`

Update a workflow share's permissions.

**Parameters:**
- `workflowShareId`: The ID of the workflow share
- `attributes.group` (optional): Group name
- `attributes.permission` (optional): Permission level

**Example:**
```typescript
const response = await client.people.person('123').workflowShares().update('456', {
  permission: 'edit',
  group: 'Staff'
});
```

### `delete(workflowShareId)`

Remove a workflow share.

**Parameters:**
- `workflowShareId`: The ID of the workflow share

**Example:**
```typescript
await client.people.person('123').workflowShares().delete('456');
```

## Creating Workflow Shares

To create a new workflow share, use the workflow resource:

```typescript
const response = await client.people.workflow('789').createShare({
  person_id: '123',
  permission: 'view',
  group: 'Volunteers'
});
```

## Workflow Share Object

```typescript
{
  type: "WorkflowShare",
  id: "456",
  attributes: {
    group: "Staff",
    permission: "edit",
    person_id: "123"
  }
}
```

## API Endpoints

- `GET /people/v2/people/{person_id}/workflow_shares`
- `GET /people/v2/people/{person_id}/workflow_shares/{id}`
- `PATCH /people/v2/people/{person_id}/workflow_shares/{id}`
- `DELETE /people/v2/people/{person_id}/workflow_shares/{id}`
- `POST /people/v2/workflows/{workflow_id}/shares` (via workflow resource)
