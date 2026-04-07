# 🏛 ARCHITECTURE | GOOD MOTION System Design

## 1. Overview
Next.js 15 Monolith architecture focusing on Server-Side efficiency, Security, and SEO.

### Tech Stack Justification
| Tech | Role | Why |
| :--- | :--- | :--- |
| **Next.js 15** | Core Framework | Server Components for SEO + Server Actions for security. |
| **Clerk** | Auth Provider | Zero-management auth, secure session handling. |
| **Supabase** | Database & Storage | PostgREST speed + integrated Video/Asset storage. |
| **Tailwind CSS** | Styling | Utility-first, zero runtime CSS overhead. |

---

## 2. System Flow (Mermaid-Friendly)
- 1. User Interaction -> Trigger Server Action
- 2. Server Action -> Validate Session with Clerk
- 3. If Valid -> Query Supabase DB & Storage
- 4. Response -> Return protected link to User Browser

---

## 3. Folder Strategy (Hybrid Structure)
We use a **Layered-Feature** hybrid approach to keep the MVP clean and scalable:

* `src/app/`: Routing layer. Contains pages and layouts (The View).
* `src/components/`: UI layer.
    * `ui/`: Global shared components (Buttons, Inputs, Modals).
    * `gallery/`: Feature-specific components (Template Cards, Filters).
* `src/actions/`: Business logic layer (Server Actions). Handles secure operations.
* `src/lib/`: Infrastructure layer. SDK initializations (Supabase, Clerk).
* `src/types/`: Definition layer. TypeScript interfaces and database schemas.

---

## 4. State Management Strategy
| State Type | Tool | Usage |
| :--- | :--- | :--- |
| **Server State** | Next.js Cache | Caching template lists and detail data. |
| **Auth State** | Clerk `useAuth` | Checking login status on the Client-side. |
| **UI State** | React `useState` | Handling search filters, toggles, and local UI logic. |
| **Persistent Data**| Supabase | All library metadata and protected remix links. |

---

## 5. Shared vs Feature Components
| Shared (`src/components/ui/`) | Feature (`src/components/gallery/`) |
| :--- | :--- |
| `Button.tsx`, `Spinner.tsx` | `TemplateCard.tsx` (Card UI) |
| `Navbar.tsx`, `Footer.tsx` | `CategoryFilter.tsx` (Filtering logic) |
| `Modal.tsx`, `Skeleton.tsx` | `RemixButton.tsx` (Contains Auth & Action logic) |

---

## 6. Critical Security Pattern (The "Hidden Remix" Rule)
To prevent link scraping and ensure only authorized users access the assets:

1. **No Pre-rendering:** Remix Links must **NEVER** be stored in the initial HTML or Client-side state.
2. **Server-Side Gate:** When a user clicks "Remix", a Server Action is triggered.
3. **Session Check:** The Server Action verifies the user via Clerk before fetching the link.
4. **Direct Delivery:** The link is returned only upon successful verification, keeping it hidden from bots.

---
*Status: Active - Last Updated: April 03, 2026*