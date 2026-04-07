# 🛠 PROJECT-RULES | GOOD MOTION Coding Standards

## 1. Naming Conventions
| Element | Convention | Example |
| :--- | :--- | :--- |
| **Folders** | kebab-case | `section-previews/`, `auth-logic/` |
| **Components** | PascalCase | `TemplateCard.tsx`, `RemixButton.tsx` |
| **Variables/Functions** | camelCase | `getRemixLink()`, `isUserLoggedIn` |
| **Server Actions** | camelCase + Action suffix | `fetchLinkAction.ts` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_REMIX_LIMIT`, `API_URL` |

---

## 2. Performance & Code Patterns

### Speed Optimization (Lazy Loading)
* **Rule:** All Video Previews must use the `loading="lazy"` attribute or `next/dynamic` to prevent slowing down the initial page load.
* **Video Metadata:** Do not preload full videos. Use an `Intersection Observer` pattern to trigger playback only when the card enters the viewport.

### Secure Link Handling (Server Actions)
* **✅ DO:** Use Next.js **Server Actions** to retrieve the Remix link from Supabase.
* **❌ DON'T:** Write fetching logic or expose the database URL directly within Client Components.
* **Code Pattern Example:**
  export async function getRemixLinkAction(id: string) {
    const { data, error } = await supabase
      .from('sections')
      .select('remix_link')
      .eq('id', id)
      .single();
    return data?.remix_link;
  }

---

## 3. Mandatory Patterns

* **Error Handling:** Every interaction (especially the Remix button click) must be wrapped in `try...catch`. Always display a user-friendly toast or message if an error occurs.
* **Auth Gate:** Use Clerk’s `auth()` helper on the Server-side to block unauthorized requests for Remix links.
* **TypeScript Strictness:** Strictly **NO `any` types**. Define all data structures using `interfaces` or `types` (e.g., `interface TemplateProps { id: string; title: string }`).

---

## 4. Restrictions (Do NOT)

| ❌ DO NOT | ✅ DO |
| :--- | :--- |
| Expose Remix links in the raw HTML source | Fetch links via Server Action only upon user click |
| Install external UI libraries (MUI, Shadcn) | Build custom UI using Tailwind CSS for maximum speed |
| Modify the Supabase Schema directly | Discuss and confirm before changing column/table names |
| Use `useEffect` for data fetching | Prefer Server Components or Server Actions |
| Hardcode sensitive keys in the frontend | Use `.env` variables and process them on the Server |

---

## 5. Git Workflow
* **Branches:** `feature/[name]` or `fix/[issue]`.
* **Commits:**
  * `feat:` for new features.
  * `fix:` for bug fixes.
  * `perf:` for performance optimizations (e.g., lazy loading).

---
*Status: Active - Last Updated: April 03, 2026*