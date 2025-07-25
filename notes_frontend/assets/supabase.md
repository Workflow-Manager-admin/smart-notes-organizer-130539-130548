# Supabase Integration for notes_frontend (Angular)

Supabase is integrated in this project using the official JavaScript SDK (`@supabase/supabase-js`).
All interaction to database and authentication is implemented in `SupabaseService`.

## Environment Variables
- `NG_APP_SUPABASE_URL`: The URL of your Supabase instance.
- `NG_APP_SUPABASE_KEY`: The public (anon) key for your Supabase instance.

Both are referenced from Angular runtime environment using:
- `(window as any)['NG_APP_SUPABASE_URL']` for client-side
- `(import.meta as any).env['NG_APP_SUPABASE_URL']` for server-side rendering

**Do not hardcode these variables.**
Set them in your `.env` file as:
```
NG_APP_SUPABASE_URL=your-supabase-url
NG_APP_SUPABASE_KEY=your-supabase-anon-key
```

## Backend Schema and Policies

**Table: notes**

| column      | type         | attributes                              |
|-------------|--------------|------------------------------------------|
| id          | uuid         | primary key, default: uuid_generate_v4() or gen_random_uuid() |
| user_id     | uuid         | not null, used for RLS                   |
| title       | text         | not null                                 |
| content     | text         |                                          |
| tags        | text[]       |                                          |
| folder      | text         |                                          |
| created_at  | timestamptz  | not null, default: now()                 |
| updated_at  | timestamptz  | not null, default: now()                 |

_Note: If you see a bigint PK, migration to uuid is recommended for new installs (manual conversion of existing data may be required)._ 

### RLS (Row Level Security) and Policies

Row Level Security is enabled on `notes`. Four policies are set:
- Select:   `auth.uid() = user_id`
- Insert:   `auth.uid() = user_id`
- Update:   `auth.uid() = user_id`
- Delete:   `auth.uid() = user_id`

This ensures users can only view and manipulate their own notes.

### SQL for Enabling RLS & Policies
```sql
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Individual user can select their notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Individual user can insert their notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Individual user can update their notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Individual user can delete their notes" ON notes FOR DELETE USING (auth.uid() = user_id);
```

## Authentication
- Email/password sign-up and sign-in is used.
- Auth state is maintained client-side and used for notes CRUD operations.

## Security
- RLS (Row Level Security) is enabled on the `notes` table, so that users can only access their own data.

## Developer Notes

- If you update the schema for the notes table, ensure you update policies and the Angular models.
- If you want to reset IDs from bigint to uuid, consider creating a new table, copying the data with new UUIDs, then swapping names.
- For detailed CRUD integration, see `src/app/services/supabase.service.ts`.

