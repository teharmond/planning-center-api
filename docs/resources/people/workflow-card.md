# Workflow Card Resource

The Workflow Card resource allows you to manage workflow cards (individual instances of a workflow) for a specific person.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const workflowCards = client.people.person('123').workflowCards();
```

## Methods

### `list()`

List all workflow cards for a person.

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().list();
console.log(response.data);
```

### `get(workflowCardId)`

Get a specific workflow card by ID.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().get('456');
console.log(response.data);
```

### `assignee(workflowCardId)`

Access the assignee resource for a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Returns:** `WorkflowCardAssigneeResource`

**Example:**
```typescript
const assignee = await client.people.person('123')
  .workflowCards()
  .assignee('456')
  .get();
console.log(assignee.data);
```

## Workflow Card Object

```typescript
{
  type: "WorkflowCard",
  id: "456",
  attributes: {
    snooze_until: "2024-02-01T10:00:00Z",
    overdue: false,
    stage: "In Progress",
    calculated_due_at_in_days_ago: 2,
    sticky_assignment: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    completed_at: null,
    flagged_for_notification_at: null,
    removed_at: null,
    moved_to_step_at: "2024-01-18T14:00:00Z"
  },
  relationships: {
    assignee: { data: { type: "Person", id: "789" } },
    person: { data: { type: "Person", id: "123" } },
    workflow: { data: { type: "Workflow", id: "101" } },
    current_step: { data: { type: "WorkflowStep", id: "202" } }
  },
  links: {
    self: "https://api.planningcenteronline.com/people/v2/people/123/workflow_cards/456",
    html: "https://people.planningcenteronline.com/workflow_cards/456"
  }
}
```

## Assignee Resource

The assignee resource allows you to get information about who is assigned to a workflow card.

### `get()`

Get the assignee for a workflow card.

**Example:**
```typescript
const response = await client.people.person('123')
  .workflowCards()
  .assignee('456')
  .get();

console.log(response.data.attributes.first_name);
console.log(response.data.attributes.last_name);
```

## API Endpoints

- `GET /people/v2/people/{person_id}/workflow_cards`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/assignee`
