# Workflow Step Resource

The Workflow Step resource allows you to manage steps within a workflow in Planning Center People.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const steps = client.people.workflow('123').step();
```

## Methods

### `list(options?)`

List all steps in a workflow.

**Parameters:**
- `options.include` (optional): Array of related resources to include (e.g., `['default_assignee']`)
- `options.order` (optional): Sort order (`'created_at'`, `'-created_at'`, `'name'`, `'-name'`, `'sequence'`, `'-sequence'`, `'updated_at'`, `'-updated_at'`)
- `options.where` (optional): Filter conditions
  - `created_at`: Filter by creation date
  - `name`: Filter by name
  - `updated_at`: Filter by update date
- `options.per_page` (optional): Results per page (1-100, default 25)
- `options.offset` (optional): Pagination offset

**Example:**
```typescript
// List all steps
const response = await client.people.workflow('123').step().list();
console.log(response.data);

// List with options
const response = await client.people.workflow('123').step().list({
  order: 'sequence',
  include: ['default_assignee'],
  per_page: 50
});
```

### `get()`

Get a specific workflow step by ID.

**Example:**
```typescript
const response = await client.people.workflow('123').step('456').get();
console.log(response.data);
```

### `create(attributes)`

Create a new step in a workflow.

**Parameters:**
- `attributes.name` (required): Step name
- `attributes.sequence` (optional): Step order/sequence number
- `attributes.description` (optional): Step description
- `attributes.expected_response_time_in_days` (optional): Expected days to complete
- `attributes.default_assignee_id` (optional): ID of default assignee
- `attributes.auto_snooze_value` (optional): Auto-snooze duration value (must be positive)
- `attributes.auto_snooze_interval` (optional): Auto-snooze interval (`'day'`, `'week'`, or `'month'`)

**Example:**
```typescript
const response = await client.people.workflow('123').step().create({
  name: 'Initial Contact',
  sequence: 1,
  description: 'Make first contact with the new member',
  expected_response_time_in_days: 3,
  default_assignee_id: '789'
});
```

### `update(attributes)`

Update an existing workflow step.

**Parameters:**
- `attributes.name` (optional): Step name
- `attributes.sequence` (optional): Step order/sequence number
- `attributes.description` (optional): Step description
- `attributes.expected_response_time_in_days` (optional): Expected days to complete
- `attributes.default_assignee_id` (optional): ID of default assignee
- `attributes.auto_snooze_value` (optional): Auto-snooze duration value
- `attributes.auto_snooze_interval` (optional): Auto-snooze interval

**Example:**
```typescript
const response = await client.people.workflow('123').step('456').update({
  name: 'Updated Step Name',
  expected_response_time_in_days: 5
});
```

### `delete()`

Delete a workflow step.

**Example:**
```typescript
await client.people.workflow('123').step('456').delete();
```

### `getDefaultAssignee()`

Get the default assignee for a workflow step.

**Returns:** Person object

**Example:**
```typescript
const response = await client.people.workflow('123').step('456').getDefaultAssignee();
console.log(response.data.attributes.first_name);
```

### `listAssigneeSummaries()`

List assignee summaries for a workflow step, showing card counts per assignee.

**Returns:** Array of assignee summary objects

**Example:**
```typescript
const response = await client.people.workflow('123').step('456').listAssigneeSummaries();
response.data.forEach(summary => {
  console.log(`Ready: ${summary.attributes.ready_count}, Snoozed: ${summary.attributes.snoozed_count}`);
});
```

## Workflow Step Object

```typescript
{
  type: "WorkflowStep",
  id: "456",
  attributes: {
    sequence: 1,
    name: "Initial Contact",
    description: "Make first contact with the new member",
    expected_response_time_in_days: 3,
    auto_snooze_value: 1,
    auto_snooze_interval: "week",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    auto_snooze_days: 7,
    my_ready_card_count: 5,
    total_ready_card_count: 10,
    default_assignee_id: "789"
  },
  relationships: {
    default_assignee: { data: { type: "Person", id: "789" } },
    workflow: { data: { type: "Workflow", id: "123" } }
  }
}
```

## Assignee Summary Object

```typescript
{
  type: "WorkflowStepAssigneeSummary",
  id: "1",
  attributes: {
    ready_count: 5,
    snoozed_count: 2
  },
  relationships: {
    person: { data: { type: "Person", id: "789" } }
  }
}
```

## API Endpoints

- `GET /people/v2/workflows/{workflow_id}/steps`
- `GET /people/v2/workflows/{workflow_id}/steps/{id}`
- `POST /people/v2/workflows/{workflow_id}/steps`
- `PATCH /people/v2/workflows/{workflow_id}/steps/{id}`
- `DELETE /people/v2/workflows/{workflow_id}/steps/{id}`
- `GET /people/v2/workflows/{workflow_id}/steps/{id}/default_assignee`
- `GET /people/v2/workflows/{workflow_id}/steps/{id}/assignee_summaries`
