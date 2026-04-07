# 🗄 DATABASE DOCUMENTATION | GOOD MOTION

## 1. Overview
- **Engine**: Supabase (PostgreSQL)
- **Architecture**: Monolithic flat-structure for MVP
- **Naming Conventions**: 
    - Tables: snake_case, plural (e.g., sections)
    - Columns: snake_case (e.g., preview_url)
    - Indexes: idx_[table]_[column]

---

## 2. Table: sections (Main Entity)
Stores all animation templates and their protected metadata.

| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | uuid | PK | gen_random_uuid() | Internal unique ID |
| slug | varchar | UNIQUE, NOT NULL | - | SEO URL (e.g., 'split-scroll') |
| title | varchar | NOT NULL | - | Display Name |
| body_text | text | - | - | Description/Instructions for UI |
| category | varchar | NOT NULL | 'General' | Hero, Scroll, Navigation, etc. |
| preview_assets | jsonb | NOT NULL | [] | List of videos/images [{url, type}] |
| remix_link | text | NOT NULL | - | **Protected: Framer Remix Link** |
| webflow_link | text | NULL | - | **Protected: Webflow Clone Link** |
| is_active | boolean | - | true | Soft delete / Hide from UI |
| created_at | timestamptz | - | now() | Record creation time |
| updated_at | timestamptz | - | now() | Last update time |

---

## 3. Relationships & ERD (Conceptual)
Current: Standalone table [sections].
Future: 
- users (1) <-> (N) favorites: For "Save for later" feature.
- categories (1) <-> (N) sections: For advanced taxonomy.

[ERD STRUCTURE]
sections {
    uuid id (PK)
    string slug (UK)
    string title
    text body_text
    text remix_link (Protected)
    text webflow_link (Protected)
    boolean is_active
}

---

## 4. Indexes (Performance)
To ensure the app stays fast as the library grows:

| Index Name | Column | Type | Reason |
| :--- | :--- | :--- | :--- |
| idx_sections_slug | slug | UNIQUE | Instant lookup for detail pages |
| idx_sections_cat | category | BTREE | Fast filtering by main categories |
| idx_sections_date | created_at | BTREE | Sorting "Newest" items on Home |

---

## 5. Security & Migration Rules (The "Law")

### Row Level Security (RLS) & Access
* **Public Access:** Only [id, slug, title, body_text, category, preview_assets] are exposed via Public API.
* **Protected Access:** [remix_link] and [webflow_link] MUST ONLY be fetched via Server Actions after a successful Clerk Auth check.

### Maintenance Rules
1. **Soft Delete:** NEVER use DELETE command. Set is_active = false to preserve history.
2. **UI Logic:** If webflow_link is NULL, the frontend must hide the "Webflow Clone" button.
3. **Migration Procedure:**
    - Update schema in Supabase SQL Editor.
    - Run 'supabase gen types typescript --local > src/types/database.ts' to sync with Code.
    - Document any changes in this file immediately.

---
*Status: Final MVP - Last Updated: April 05, 2026*