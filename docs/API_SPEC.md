# 📡 API SPECIFICATION | GOOD MOTION

## 1. Overview
- **Protocol**: Next.js 15 Server Actions (Type-safe RPC).
- **Auth Layer**: Clerk (Automatic Cookie-based, no manual tokens).
- **Format**: JSON UTF-8.
- **Base Architecture**: Server-Side logic for Secure Asset Delivery.

---

## 2. Standard Response Format (Standardized)
Adopted professional structure for consistent Frontend handling:

SUCCESS RESPONSE:
- success: true
- data: { ... }
- message: "Operation completed"

ERROR RESPONSE:
- success: false
- error: { code: "ERR_XXX", message: "Human readable message", details: null }

---

## 3. Server Actions (Endpoints)

### Feature: Library (Public)
| Action | Params | Return | Auth |
| :--- | :--- | :--- | :--- |
| getSections | category: string, search: string | List of cards | No |
| getSectionDetail | slug: string | Full detail + Body text | No |

### Feature: Protected Assets (Private)
| Action | Params | Return | Auth |
| :--- | :--- | :--- | :--- |
| getProtectedLinks | sectionId: string | { remix_link, webflow_link, framer_component_link } | Yes (Clerk) |

---

## 4. Error Codes Mapping (Inspired by Prof)
Error system for smooth debugging and UI handling:

| Code | Status | Description | UI Action |
| :--- | :--- | :--- | :--- |
| AUTH_001 | 401 | Not logged in | Redirect to /sign-in |
| SEC_404 | 404 | Section not found | Show 404 Page |
| SYS_500 | 500 | Database connection failed | Show Toast Error |
| RATE_001 | 429 | Too many requests | Show "Slow down" message |

---

## 5. Development Rules
1. Zero Manual Tokens: Never store tokens in localStorage. Use Clerk's auth() directly within Server Actions to verify permissions.
2. Server-Side Validation: All asset-fetching actions must re-verify the User Session on the Server (never trust client-side data).
3. Type Safety: Reuse interfaces from database.types.ts to ensure Server-to-UI data synchronization.
4. Loading States: Frontend must utilize useTransition or isPending from Next.js when calling Actions to display loading states for Remix/Webflow buttons.

---
*Status: Final API Spec - Last Updated: April 05, 2026*