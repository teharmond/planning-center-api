# Workflow Card Resource

The Workflow Card resource allows you to manage workflow cards (individual instances of a workflow) for a specific person.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const workflowCards = client.people.person('123').workflowCards();
```

## Methods

### `list(options?)`

List all workflow cards for a person with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for filtering (see Where Options below)
- `options.order` (optional): Sort order (e.g., `'created_at'`, `'-updated_at'`, `'stage'`)
- `options.include` (optional): Comma-separated string of related resources to include

**Where Options:**
- `assignee_id` - Filter by assignee ID
- `overdue` - Filter by overdue status (`'true'` or `'false'`)
- `stage` - Filter by stage
- `created_at` - Filter by creation date
- `updated_at` - Filter by update date

**Example:**
```typescript
// Basic list
const response = await client.people.person('123').workflowCards().list();
console.log(response.data);

// With pagination
const response = await client.people.person('123').workflowCards().list({
  per_page: 50,
  offset: 0
});

// With sorting
const response = await client.people.person('123').workflowCards().list({
  order: '-created_at'
});

// Filter by stage
const response = await client.people.person('123').workflowCards().list({
  where: {
    stage: 'In Progress'
  }
});

// Filter by overdue
const response = await client.people.person('123').workflowCards().list({
  where: {
    overdue: 'true'
  }
});

// Filter by assignee
const response = await client.people.person('123').workflowCards().list({
  where: {
    assignee_id: '789'
  }
});

// Combined options
const response = await client.people.person('123').workflowCards().list({
  per_page: 25,
  order: '-updated_at',
  include: 'assignee,workflow'
});
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

### `getActivity(workflowCardId, activityId)`

Get a specific activity for a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `activityId`: The ID of the activity

**Returns:** Workflow card activity object

**Example:**
```typescript
const response = await client.people.person('123').workflowCards().getActivity('456', '789');
console.log(response.data.attributes.content);
```

### `deleteActivity(workflowCardId, activityId)`

Delete a specific activity from a workflow card.

**Parameters:**
- `workflowCardId`: The ID of the workflow card
- `activityId`: The ID of the activity

**Example:**
```typescript
await client.people.person('123').workflowCards().deleteActivity('456', '789');
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

## Workflow Card Activity Object

```typescript
{
  type: "WorkflowCardActivity",
  id: "789",
  attributes: {
    comment: "Left a voicemail",
    content: "Called John about follow-up",
    form_submission_url: null,
    automation_url: null,
    person_avatar_url: "https://example.com/avatar.jpg",
    person_name: "Jane Smith",
    reassigned_to_avatar_url: null,
    reassigned_to_name: null,
    subject: "Follow-up call",
    type: "note",
    content_is_html: false,
    created_at: "2024-01-18T14:30:00Z"
  },
  relationships: {
    workflow_card: { data: { type: "WorkflowCard", id: "456" } },
    workflow_step: { data: { type: "WorkflowStep", id: "202" } }
  }
}
```

**Note:** The `workflow_step` relationship is only available when the activity `type` is `completion`, `skip`, or `reversal`.

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
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/activities/{activity_id}`
- `DELETE /people/v2/people/{person_id}/workflow_cards/{id}/activities/{activity_id}`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/assignee`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/current_step`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/notes`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/notes/{note_id}`
- `POST /people/v2/people/{person_id}/workflow_cards/{id}/notes`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/person`
- `GET /people/v2/people/{person_id}/workflow_cards/{id}/workflow`
- `POST /people/v2/workflows/{workflow_id}/cards` (via workflow resource)
