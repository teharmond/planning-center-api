# Workflow Resource

The Workflow resource allows you to manage workflows in Planning Center People.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const workflow = client.people.workflow(workflowId);
```

## Methods

### `list(options?)`

List all workflows with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for filtering (see Where Options below)
- `options.order` (optional): Sort order (e.g., `'name'`, `'-created_at'`)
- `options.include` (optional): Comma-separated string of related resources to include (see Include Options below)

**Include Options:**
- `category` - Include associated workflow category
- `shares` - Include associated workflow shares
- `steps` - Include associated workflow steps

**Where Options:**
- `name` - Filter by workflow name
- `workflow_category_id` - Filter by workflow category ID
- `campus_id` - Filter by campus ID
- `id` - Filter by workflow ID
- `archived_at` - Filter by archived date
- `deleted_at` - Filter by deleted date
- `created_at` - Filter by creation date
- `updated_at` - Filter by update date

**Example:**
```typescript
// Basic list
const response = await client.people.workflow().list();
console.log(response.data);

// Filter by name
const response = await client.people.workflow().list({
  where: {
    name: 'New Member Onboarding'
  }
});

// Filter by category
const response = await client.people.workflow().list({
  where: {
    workflow_category_id: '456'
  }
});

// With pagination and sorting
const response = await client.people.workflow().list({
  per_page: 50,
  offset: 0,
  order: 'name'
});

// With includes
const response = await client.people.workflow().list({
  include: 'category,steps'
});

// Combined filters
const response = await client.people.workflow().list({
  where: {
    workflow_category_id: '456',
    campus_id: '789'
  },
  order: '-created_at',
  include: 'steps'
});
```

### `get()`

Get a single workflow by ID.

**Example:**
```typescript
const response = await client.people.workflow('123').get();
console.log(response.data);
```

### `create(attributes)`

Create a new workflow.

**Parameters:**
- `attributes.name` (required): Workflow name
- `attributes.campus_id` (optional): Campus ID
- `attributes.workflow_category_id` (optional): Workflow category ID

**Example:**
```typescript
const response = await client.people.workflow().create({
  name: 'New Member Onboarding',
  workflow_category_id: '456'
});
```

### `update(attributes)`

Update an existing workflow.

**Parameters:**
- `attributes.name` (optional): Workflow name
- `attributes.campus_id` (optional): Campus ID
- `attributes.workflow_category_id` (optional): Workflow category ID

**Example:**
```typescript
const response = await client.people.workflow('123').update({
  name: 'Updated Workflow Name'
});
```

### `delete()`

Delete a workflow.

**Example:**
```typescript
await client.people.workflow('123').delete();
```

### `listCards(options?)`

List all workflow cards in this workflow with optional filtering and pagination.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 25, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.where` (optional): Object with key-value pairs for filtering (see Where Options below)
- `options.order` (optional): Sort order (e.g., `'created_at'`, `'-updated_at'`, `'stage'`)
- `options.include` (optional): Comma-separated string of related resources to include (see Include Options below)

**Include Options:**
- `assignee` - Include associated assignee (Person)
- `current_step` - Include associated current step (WorkflowStep)
- `person` - Include associated person (Person)
- `workflow` - Include associated workflow (Workflow)

**Where Options:**
- `assignee_id` - Filter by assignee ID
- `overdue` - Filter by overdue status (`'true'` or `'false'`)
- `stage` - Filter by stage

**Returns:** Array of workflow cards

**Example:**
```typescript
// Basic list
const response = await client.people.workflow('123').listCards();
console.log(response.data);

// With includes
const response = await client.people.workflow('123').listCards({
  include: 'assignee,current_step,person'
});

// Filter by overdue
const response = await client.people.workflow('123').listCards({
  where: { overdue: 'true' }
});

// Combined options
const response = await client.people.workflow('123').listCards({
  per_page: 50,
  where: { overdue: 'true' },
  include: 'assignee,current_step',
  order: '-created_at'
});
```

### `createCard(attributes)`

Create a new workflow card in this workflow.

**Parameters:**
- `attributes.person_id` (required): ID of the person for this card
- `attributes.assignee_id` (optional): ID of the person to assign to
- `attributes.sticky_assignment` (optional): Whether the assignment is sticky

**Example:**
```typescript
const response = await client.people.workflow('123').createCard({
  person_id: '456',
  assignee_id: '789',
  sticky_assignment: true
});
```

### `getCategory()`

Get the category for this workflow.

**Returns:** Workflow category object

**Example:**
```typescript
const response = await client.people.workflow('123').getCategory();
console.log(response.data);
```

### `listSteps()`

List all steps in this workflow.

**Returns:** Array of workflow steps

**Example:**
```typescript
const response = await client.people.workflow('123').listSteps();
console.log(response.data);
```

### `step(stepId?)`

Access the workflow step resource for full CRUD operations.

**Parameters:**
- `stepId` (optional): The ID of a specific step

**Returns:** `WorkflowStepResource`

**Example:**
```typescript
// List steps with options
const steps = await client.people.workflow('123').step().list({
  order: 'sequence',
  include: ['default_assignee']
});

// Get a specific step
const step = await client.people.workflow('123').step('456').get();

// Create a new step
const newStep = await client.people.workflow('123').step().create({
  name: 'Follow Up',
  sequence: 2,
  description: 'Follow up with the new member'
});

// Update a step
await client.people.workflow('123').step('456').update({
  name: 'Updated Step Name'
});

// Delete a step
await client.people.workflow('123').step('456').delete();
```

See [Workflow Step](./workflow-step.md) for full documentation.

### `listSharedPeople()`

List all people who have access to this workflow.

**Returns:** Array of people

**Example:**
```typescript
const response = await client.people.workflow('123').listSharedPeople();
console.log(response.data);
```

### `createShare(attributes)`

Share this workflow with a person or group.

**Parameters:**
- `attributes.person_id` (optional): Person ID to share with
- `attributes.group` (optional): Group to share with
- `attributes.permission` (optional): Permission level

**Example:**
```typescript
const response = await client.people.workflow('123').createShare({
  person_id: '456',
  permission: 'edit'
});
```

## Workflow Object

```typescript
{
  type: "Workflow",
  id: "123",
  attributes: {
    name: "New Member Onboarding",
    my_ready_card_count: 5,
    total_ready_card_count: 10,
    completed_card_count: 25,
    total_cards_count: 35,
    total_ready_and_snoozed_card_count: 12,
    overdue_card_count: 2,
    stages: ["Step 1", "Step 2", "Step 3"],
    category_id: "789",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T15:30:00Z",
    deleted_at: null,
    my_overdue_card_count: 1,
    my_due_soon_card_count: 3,
    name_or_child_name: "New Member Onboarding",
    recently_viewed: true,
    total_orphaned_card_count: 0
  }
}
```

## API Endpoints

- `GET /people/v2/workflows`
- `GET /people/v2/workflows/{id}`
- `POST /people/v2/workflows`
- `PATCH /people/v2/workflows/{id}`
- `DELETE /people/v2/workflows/{id}`
- `GET /people/v2/workflows/{id}/cards`
- `POST /people/v2/workflows/{id}/cards`
- `GET /people/v2/workflows/{id}/category`
- `GET /people/v2/workflows/{id}/steps`
- `GET /people/v2/workflows/{id}/steps/{step_id}`
- `POST /people/v2/workflows/{id}/steps`
- `PATCH /people/v2/workflows/{id}/steps/{step_id}`
- `DELETE /people/v2/workflows/{id}/steps/{step_id}`
- `GET /people/v2/workflows/{id}/shared_people`
- `POST /people/v2/workflows/{id}/shares`
