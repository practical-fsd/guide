# Practical FSD v1.0 - Basic Example

> **English** | [한국어](./README.ko.md)

This example demonstrates the basic structure of **Next.js 15 + FSD v1.0 architecture**.

## Key Features

- ✅ Next.js 15.5.4 + App Router
- ✅ React 19.1.0
- ✅ React Compiler enabled
- ✅ FSD 6-layer structure (`pages` → `views`)
- ✅ TypeScript Path Aliases
- ✅ Tailwind CSS 4

## Project Structure

```
v1.0-basic/
└── src/
    ├── app/                # Next.js App Router (routing only)
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Home (→ views/home)
    │   └── dashboard/
    │       └── page.tsx    # Dashboard (→ views/dashboard)
    │
    ├── views/              # Page composition (FSD's pages)
    │   ├── home/
    │   │   ├── ui/
    │   │   │   └── HomePage.tsx
    │   │   └── index.ts
    │   └── dashboard/
    │       └── ui/
    │           └── DashboardPage.tsx
    │
    ├── widgets/            # Independent UI blocks
    │   ├── header/
    │   │   ├── ui/
    │   │   │   └── Header.tsx
    │   │   └── index.ts
    │   └── footer/
    │
    ├── features/           # User scenarios
    │   └── course-list/
    │       ├── ui/
    │       │   └── CourseList.tsx
    │       └── index.ts
    │
    ├── entities/           # Business entities
    │   └── course/
    │       ├── api/
    │       │   └── getCourses.ts
    │       ├── model/
    │       │   └── types.ts
    │       └── index.ts
    │
    └── shared/             # Common utilities
        ├── components/
        │   └── common/
        │       ├── Button.tsx
        │       └── Input.tsx
        ├── lib/
        ├── hooks/
        └── types/
```

## Core Concepts

### 1. app/ = Routing Only

```typescript
// src/app/page.tsx
// ✅ Thin routing layer - only imports from views/
import { HomePage } from '@/views/home';

export default HomePage;
```

### 2. views/ = Page Composition

```typescript
// src/views/home/ui/HomePage.tsx
// ✅ Actual page implementation
import { Header } from '@/widgets/header';
import { CourseList } from '@/features/course-list';

export function HomePage() {
  return (
    <>
      <Header />
      <CourseList />
    </>
  );
}
```

### 3. FSD Layer Rules

```
views/     → widgets/ + features/
widgets/   → features/ + entities/
features/  → entities/ + shared/
entities/  → shared/
shared/    → (external libraries only)
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open http://localhost:3000

## Learning Path

1. [Why pages → views](../../docs/v1.0/en/pages-to-views.md)
2. [App Router Integration Guide](../../docs/v1.0/en/app-router-integration.md)
3. [6-Layer Structure Details](../../docs/v1.0/en/six-layers.md)

## Key Files Overview

| File | Role | Description |
|------|------|-------------|
| `src/app/page.tsx` | Routing | Only imports views/home |
| `src/views/home/` | Page | Composes widgets/features |
| `src/widgets/header/` | Widget | Reusable UI block |
| `src/features/course-list/` | Feature | User scenario |
| `src/entities/course/` | Entity | Business data |
| `src/shared/components/` | Shared | UI components |

## Learn More

- [Next.js 15 Docs](https://nextjs.org/docs)
- [FSD Official Docs](https://feature-sliced.design/)
- [React Compiler](https://react.dev/learn/react-compiler)
