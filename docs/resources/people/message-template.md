# Message Template Resource

The Message Template resource allows you to retrieve email templates from Planning Center People.

## Usage

```typescript
import { PlanningCenter } from 'planning-center-api';

const client = new PlanningCenter({ /* config */ });
const templates = await client.people.messageTemplates().list();
```

## Methods

### `list(options?)`

List all message templates.

**Parameters:**
- `options.per_page` (optional): Number of records per page (default: 100, min: 1, max: 100)
- `options.offset` (optional): Number of records to skip for pagination
- `options.order` (optional): Sort order (`'subject'` or `'-subject'`)
- `options.autoPaginate` (optional): Override the default autoPaginate setting

**Example:**
```typescript
// Basic list
const response = await client.people.messageTemplates().list();

// With pagination
const response = await client.people.messageTemplates().list({
  per_page: 50,
  offset: 100
});

// Ordered by subject
const response = await client.people.messageTemplates().list({
  order: 'subject'
});
```

### `get(id)`

Get a single message template by ID.

**Parameters:**
- `id` (required): The message template ID

**Example:**
```typescript
const response = await client.people.messageTemplates().get('336889');
```

## Response

Returns an `ApiResponse<MessageTemplate[]>` for list or `ApiResponse<MessageTemplate>` for get, with:
- `data`: Message template object(s) containing:
  - `id`: The template ID
  - `type`: `"MessageTemplate"`
  - `attributes`:
    - `body`: The HTML body of the email template
    - `subject`: The subject line of the email template
- `meta`: Pagination and metadata
  - `total_count`: Total number of records
  - `count`: Number of records in current response
  - `can_order_by`: Available sort fields (`["subject"]`)
  - `parent`: Parent organization info
- `links`: Pagination links

## API Endpoints

- `GET /people/v2/message_templates`
- `GET /people/v2/message_templates/{id}`
