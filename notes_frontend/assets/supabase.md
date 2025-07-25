# Supabase Integration for notes_frontend (Angular)

Supabase is integrated in this project using the official JavaScript SDK (@supabase/supabase-js).
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

## Schema Requirements

**Table: notes**
- id: uuid (PK)
- user_id: uuid
- title: string
- content: text
- tags: string[]
- folder: string
- created_at: timestamp
- updated_at: timestamp

Tables must be created and handled in the Supabase Dashboard or with migrations as per your backend/database container.

## Authentication
- Email/password sign-up and sign-in is used.
- Auth state is maintained client-side and used for notes CRUD operations.

## Security
- Ensure RLS (Row Level Security) is enabled on the `notes` table, so that users can only access their own data.
