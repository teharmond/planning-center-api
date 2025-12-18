# Note Resource

A note is text with a category connected to a person's profile.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });

// Access notes for a specific person
const personNotes = client.people.person('123').notes();

// Access all notes across the organization
const allNotes = client.people.notes();

// Access a specific note by ID
const note = client.people.note('456');
```

## Methods

### List Notes for a Person

```typescript
const notes = await client.people.person('123').notes().list();

// With options
const notes = await client.people.person('123').notes().list({
  per_page: 50,
  order: '-created_at',
  include: ['category', 'created_by']
});
```

### List All Notes

```typescript
const allNotes = await client.people.listNotes();

// With filtering
const filteredNotes = await client.people.listNotes({
  where: { note_category_id: '789' },
  order: '-display_date',
  include: ['category', 'person']
});
```

### Get a Specific Note

```typescript
const note = await client.people.note('456').get();

// With includes
const note = await client.people.note('456').get({
  include: ['category', 'created_by', 'person']
});
```

### Create a Note

Notes are created on a person:

```typescript
const newNote = await client.people.person('123').notes().create({
  note: 'This is a note about the person.',
  note_category_id: '789',
  display_date: '2024-01-15T10:00:00Z'
});
```

**Create Attributes:**
- `note` (required): The note text content
- `note_category_id` (required): ID of the note category
- `created_at` (optional): Creation timestamp
- `updated_at` (optional): Last update timestamp
- `display_date` (optional): Display date for the note

### Update a Note

```typescript
const updatedNote = await client.people.note('456').update({
  note: 'Updated note content',
  note_category_id: '999'
});
```

**Update Attributes:**
- `note` (optional): The note text content
- `note_category_id` (optional): ID of the note category
- `created_at` (optional): Creation timestamp
- `updated_at` (optional): Last update timestamp
- `display_date` (optional): Display date for the note

### Delete a Note

```typescript
await client.people.note('456').delete();
```

## Associations

### Get Note Category

```typescript
const category = await client.people.note('456').getCategory();
```

### Get Created By (Person)

```typescript
const creator = await client.people.note('456').getCreatedBy();
```

### Get Person

```typescript
const person = await client.people.note('456').getPerson();
```

## Query Options

### Includes

Available includes for notes:
- `category` - Include the note category
- `created_by` - Include the person who created the note
- `person` - Include the person the note belongs to

### Where Filters

- `note` - Query by note content
- `note_category_id` - Query by category ID

### Order By

- `created_at` / `-created_at`
- `display_date` / `-display_date`
- `id` / `-id`
- `note` / `-note`
- `note_category_id` / `-note_category_id`
- `updated_at` / `-updated_at`

## API Endpoints

- `GET /people/v2/notes` - List all notes
- `GET /people/v2/notes/{id}` - Get a specific note
- `POST /people/v2/people/{person_id}/notes` - Create a note for a person
- `PATCH /people/v2/notes/{id}` - Update a note
- `DELETE /people/v2/notes/{id}` - Delete a note
- `GET /people/v2/notes/{id}/category` - Get note's category
- `GET /people/v2/notes/{id}/created_by` - Get note's creator
- `GET /people/v2/notes/{id}/person` - Get note's person
- `GET /people/v2/people/{person_id}/notes` - List notes for a person

## Example Response

```json
{
  "type": "Note",
  "id": "1",
  "attributes": {
    "note": "string",
    "created_at": "2000-01-01T12:00:00Z",
    "updated_at": "2000-01-01T12:00:00Z",
    "display_date": "2000-01-01T12:00:00Z",
    "note_category_id": "primary_key",
    "organization_id": "primary_key",
    "person_id": "primary_key",
    "created_by_id": "primary_key"
  },
  "relationships": {
    "note_category": {
      "data": {
        "type": "NoteCategory",
        "id": "1"
      }
    },
    "person": {
      "data": {
        "type": "Person",
        "id": "1"
      }
    },
    "created_by": {
      "data": {
        "type": "Person",
        "id": "1"
      }
    }
  }
}
```
