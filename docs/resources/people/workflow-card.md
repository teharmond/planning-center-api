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

### `update(workflowCardId, attributes)`

Update a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `attributes.sticky_assignment` (optional): Whether the assignment is sticky
- `attributes.assignee_id` (optional): ID of the person to assign to
- `attributes.person_id` (optional): ID of the person associated with the card

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().update('456', {
  assignee_id: '789',
  sticky_assignment: true
});
```

### `delete(workflowCardId)`

Delete a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().delete('456');
```

### `goBack(workflowCardId)`

Move a workflow card back to the previous step.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().goBack('456');
```

### `promote(workflowCardId)`

Promote a workflow card to the next step.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().promote('456');
```

### `remove(workflowCardId)`

Remove a workflow card (marks it as removed).

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().remove('456');
```

### `restore(workflowCardId)`

Restore a removed workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().restore('456');
```

### `sendEmail(workflowCardId, subject, note)`

Send an email related to a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `subject`: Email subject
- `note`: Email body/note

**Example:**
```typescript
await client.people.person('123').workflowCards().sendEmail(
  '456',
  'Thanks for visiting!',
  'It was great to meet you this past Sunday!'
);
```

### `skipStep(workflowCardId)`

Skip the current step in the workflow.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().skipStep('456');
```

### `snooze(workflowCardId, duration)`

Snooze a workflow card for a specified duration.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `duration`: Duration in days to snooze

**Example:**
```typescript
await client.people.person('123').workflowCards().snooze('456', 15);
```

### `unsnooze(workflowCardId)`

Unsnooze a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Example:**
```typescript
await client.people.person('123').workflowCards().unsnooze('456');
```

### `listActivities(workflowCardId)`

List all activities for a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Returns:** Array of workflow card activities

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().listActivities('456');
console.log(response.data);
```

### `getCurrentStep(workflowCardId)`

Get the current step of a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Returns:** Workflow step object

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().getCurrentStep('456');
console.log(response.data.attributes.name);
```

### `listNotes(workflowCardId)`

List all notes for a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Returns:** Array of workflow card notes

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().listNotes('456');
console.log(response.data);
```

### `getNote(workflowCardId, noteId)`

Get a specific note for a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `noteId`: The ID of the note

**Returns:** Workflow card note object

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().getNote('456', '789');
console.log(response.data.attributes.note);
```

### `createNote(workflowCardId, attributes)`

Create a new note on a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `attributes.note` (required): The note content

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().createNote('456', {
  note: 'Called and left voicemail. Will follow up next week.'
});
console.log(response.data);
```

### `getPerson(workflowCardId)`

Get the person associated with a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Returns:** Person object

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().getPerson('456');
console.log(response.data);
```

### `getWorkflow(workflowCardId)`

Get the workflow associated with a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card

**Returns:** Workflow object

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().getWorkflow('456');
console.log(response.data.attributes.name);
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

## Creating Workflow Cards

To create a new workflow card, use the workflow resource:

```typescript
const response = await client.people.workflow('789').createCard({
  person_id: '123',
  assignee_id: '456',
  sticky_assignment: true
});
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
- `PATCH /people/v2/people/{person_id}/workflow_cards/{id}`
- `DELETE /people/v2/people/{person_id}/workflow_cards/{id}`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/go_back`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/promote`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/remove`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/restore`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/send_email`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/skip_step`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/snooze`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/unsnooze`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/activities`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/assignee`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/current_step`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/notes`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/notes/{note_id}`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/notes`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/person`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/workflow`
- `POST /people/v2/workflows/{workflow_id}/cards` (via workflow resource)
