# Note Category Resource

A Note Category is used to organize and classify notes in Planning Center People.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });

// Access note categories
const categories = client.people.noteCategory();

// Access a specific note category by ID
const category = client.people.noteCategory('123');
```

## Methods

### List Note Categories

```typescript
const categories = await client.people.noteCategory().list();

// With options
const categories = await client.people.noteCategory().list({
  per_page: 50,
  order: 'name',
  include: ['shares', 'subscribers']
});

// Using the convenience method
const categories = await client.people.listNoteCategories({
  where: { locked: 'false' }
});
```

### Get a Specific Note Category

```typescript
const category = await client.people.noteCategory('123').get();

// With includes
const category = await client.people.noteCategory('123').get({
  include: ['shares', 'subscribers', 'subscriptions']
});
```

### Create a Note Category

```typescript
const newCategory = await client.people.noteCategory().create({
  name: 'Pastoral Notes'
});
```

**Create Attributes:**
- `name` (required): The name of the category

### Update a Note Category

```typescript
const updatedCategory = await client.people.noteCategory('123').update({
  name: 'Updated Category Name'
});
```

**Update Attributes:**
- `name` (optional): The name of the category

### Delete a Note Category

**Note:** Deleting a note category will also delete all associated notes.

```typescript
await client.people.noteCategory('123').delete();
```

## Associations

### List Shares

Get the shares for a note category:

```typescript
const shares = await client.people.noteCategory('123').listShares();
```

### List Subscribers

Get the people subscribed to a note category:

```typescript
const subscribers = await client.people.noteCategory('123').listSubscribers();
```

### List Subscriptions

Get the subscriptions for a note category:

```typescript
const subscriptions = await client.people.noteCategory('123').listSubscriptions();
```

## Query Options

### Includes

Available includes for note categories:
- `shares` - Include associated shares
- `subscribers` - Include associated subscribers
- `subscriptions` - Include associated subscriptions

### Where Filters

- `created_at` - Query by creation date
- `locked` - Query by locked status (`true` or `false`)
- `name` - Query by category name
- `organization_id` - Query by organization ID
- `updated_at` - Query by update date

### Order By

- `created_at` / `-created_at`
- `locked` / `-locked`
- `name` / `-name`
- `organization_id` / `-organization_id`
- `updated_at` / `-updated_at`

## API Endpoints

- `GET /people/v2/note_categories` - List all note categories
- `GET /people/v2/note_categories/{id}` - Get a specific note category
- `POST /people/v2/note_categories` - Create a note category
- `PATCH /people/v2/note_categories/{id}` - Update a note category
- `DELETE /people/v2/note_categories/{id}` - Delete a note category
- `GET /people/v2/note_categories/{id}/shares` - List shares
- `GET /people/v2/note_categories/{id}/subscribers` - List subscribers
- `GET /people/v2/note_categories/{id}/subscriptions` - List subscriptions
- `GET /people/v2/notes/{note_id}/category` - Get category for a note

## Example Response

```json
{
  "type": "NoteCategory",
  "id": "1",
  "attributes": {
    "name": "string",
    "locked": true,
    "created_at": "2000-01-01T12:00:00Z",
    "updated_at": "2000-01-01T12:00:00Z",
    "organization_id": "primary_key"
  },
  "relationships": {
    "organization": {
      "data": {
        "type": "Organization",
        "id": "1"
      }
    }
  }
}
```

## Related Types

### NoteCategoryShare

```typescript
interface NoteCategoryShare {
  id: string;
  type: "NoteCategoryShare";
  attributes: {
    group?: string;
    permission?: string;
    person_id?: string;
    created_at?: string;
    updated_at?: string;
  };
}
```

### NoteCategorySubscription

```typescript
interface NoteCategorySubscription {
  id: string;
  type: "NoteCategorySubscription";
  attributes: {
    created_at?: string;
    updated_at?: string;
  };
}
```
