# Person Resource

The Person resource allows you to manage individual people in Planning Center People.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const person = client.people.person(personId);
```

## Methods

### `get(options?)`

Get a single person by ID.

**Parameters:**
- `options.include` (optional): Include related resources. Can be a single value or array of:
  - `addresses`
  - `emails`
  - `field_data`
  - `households`
  - `inactive_reason`
  - `marital_status`
  - `name_prefix`
  - `name_suffix`
  - `organization`
  - `person_apps`
  - `phone_numbers`
  - `platform_notifications`
  - `primary_campus`
  - `school`
  - `social_profiles`

**Example:**
```typescript
const response = await client.people.person('123').get();
console.log(response.data);

// With includes
const response = await client.people.person('123').get({
  include: ['emails', 'phone_numbers']
});
```

### `create(attributes)`

Create a new person.

**Parameters:**
- `attributes`: Object containing person attributes
  - `first_name` (optional): First name
  - `last_name` (optional): Last name
  - `birthdate` (optional): Birthdate in ISO format
  - `anniversary` (optional): Anniversary in ISO format
  - `gender` (optional): Gender
  - `gender_id` (optional): Gender ID
  - `grade` (optional): Grade level
  - `graduation_year` (optional): Graduation year
  - `child` (optional): Boolean indicating if person is a child
  - `status` (optional): Status
  - `membership` (optional): Membership status
  - `accounting_administrator` (optional): Boolean
  - `site_administrator` (optional): Boolean
  - `people_permissions` (optional): Permissions level
  - `primary_campus_id` (optional): Primary campus ID
  - `remote_id` (optional): External system ID
  - And more...

**Example:**
```typescript
const response = await client.people.person().create({
  first_name: 'John',
  last_name: 'Doe',
  birthdate: '1990-01-15'
});
```

### `update(attributes)`

Update an existing person.

**Parameters:**
- `attributes`: Object containing person attributes to update (same as create)

**Example:**
```typescript
const response = await client.people.person('123').update({
  first_name: 'Jane',
  last_name: 'Smith'
});
```

### `delete()`

Delete a person.

**Example:**
```typescript
await client.people.person('123').delete();
```

### `workflowCards()`

Access workflow cards for this person.

**Returns:** `WorkflowCardResource`

**Example:**
```typescript
const cards = await client.people.person('123').workflowCards().list();
```

### `workflowShares()`

Access workflow shares for this person.

**Returns:** `WorkflowShareResource`

**Example:**
```typescript
const shares = await client.people.person('123').workflowShares().list();
```

## API Endpoints

- `GET /people/v2/people/{id}`
- `POST /people/v2/people`
- `PATCH /people/v2/people/{id}`
- `DELETE /people/v2/people/{id}`
