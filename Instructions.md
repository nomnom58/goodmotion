# 🚀 GOOD MOTION | Core Context

## 0. Overview
* **Project:** A library of Framer Sections integrated with GSAP (Remix links).
* **Stage:** MVP (Prioritize execution speed and smooth user experience).
* **Target Audience:** UI/UX Designers, Framer Users.
* **Goal:** Share high-end animation resources; Auth required to access links.

## 1. Tech Stack
* **Core:** Next.js 15, TypeScript, Clerk (Auth), Supabase (DB/Storage).
* **Animations:** GSAP 3 (via esm.sh for Framer environment).
* **Styling:** Tailwind CSS.
* **Package Manager:** `pnpm`.

## 2. Directory Structure
* `src/app/`: App Router (Home grid & `/section/[slug]` dynamic detail pages).
* `src/components/`: Reusable UI components (Buttons, Cards, Navigation).
* `src/actions/`: Server Actions to fetch Remix links post-authentication.

## 3. Coding Standards
* **Naming:** **PascalCase** for Components/Files; **camelCase** for variables/functions.
* **Style:** Single quotes, no semicolons, 2-space indentation.
* **Pattern:** Functional Components, Arrow functions, `async/await`.
* **Icons:** `lucide-react`.

## 4. Architecture Decisions
* **Hidden Links:** Remix links **MUST NOT** exist in the client-side HTML. Fetch via **Server Action** only upon click (Anti-bot measure).
* **Minimal DB:** Single table `sections` on Supabase.
* **Auth Gate:** Users must be logged in via Clerk to view/access the Remix button link.

## 5. Restrictions (Do NOT)
* **DO NOT** install new dependencies without explicit confirmation.
* **DO NOT** modify the Database Schema on Supabase.
* **DO NOT** use external UI libraries (e.g., MUI, Shadcn/ui). Use custom Tailwind CSS only.
* **DO NOT** refactor code outside the requested scope.
* **DO NOT** write overly complex logic; if a "quick-win" solution works reliably, prioritize it.

## 6. Mandatory Workflow
Before writing ANY code, you MUST reference the specifications in the `/docs` folder:
* **PROJECT-RULES.md**: Coding standards & High-level guidelines.
* **ARCHITECTURE.md**: Tech stack details (Next.js 15, Clerk, Supabase).
* **DATABASE.md**: Schema & Data integrity.
* **API_SPEC.md**: Server Actions & Response formats.

---
Last Updated: April 03, 2026