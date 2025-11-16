# FSD 6-Layer Structure Complete Guide

> [한국어](../ko/six-layers.md) | **English**

## Overview

Feature-Sliced Design (FSD) structures frontend applications into **6 layers**. Each layer has clear responsibilities and follows **unidirectional dependency rules**.

```
views/      ← Page composition (FSD's pages, renamed)
   ↓
widgets/    ← Independent UI blocks
   ↓
features/   ← User scenarios
   ↓
entities/   ← Business entities
   ↓
shared/     ← Common utilities
   ↓
(External libraries)
```

**Core Rule**: Upper layers can only import from lower layers (no reverse)

## 1. views/ - Page Composition Layer

### Role

- Compose complete pages by combining widgets and features
- Actual pages imported from Next.js `app/`
- Can contain page-level business logic

### Structure

```
src/views/
├── home/
│   ├── ui/
│   │   └── HomePage.tsx
│   └── index.ts
├── dashboard/
│   ├── ui/
│   │   ├── DashboardPage.tsx
│   │   └── DashboardSkeleton.tsx
│   ├── model/
│   │   └── useDashboardData.ts
│   └── index.ts
└── course-detail/
    ├── ui/
    │   └── CourseDetailPage.tsx
    └── index.ts
```

### Example

```typescript
// src/views/home/ui/HomePage.tsx
'use client';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CourseList } from '@/features/course-list';
import { HeroSection } from '@/widgets/hero';

export function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <CourseList />
      <Footer />
    </div>
  );
}
```

### Import Rules

✅ Allowed:
- `@/widgets/*` - Compose widgets
- `@/features/*` - Use features
- `@/entities/*` - Use entity data
- `@/shared/*` - Use common utilities

❌ Not Allowed:
- Import other views (no inter-page dependencies)
- Import src/app/ (Next.js routing layer)

## 2. widgets/ - Independent UI Block Layer

### Role

- Reusable, self-contained UI blocks
- Compose features and entities
- Can be used across multiple pages

### Structure

```
src/widgets/
├── header/
│   ├── ui/
│   │   └── Header.tsx
│   └── index.ts
├── footer/
│   ├── ui/
│   │   └── Footer.tsx
│   └── index.ts
└── course-filters/
    ├── ui/
    │   └── CourseFilters.tsx
    ├── model/
    │   └── useFilters.ts
    └── index.ts
```

### Example

```typescript
// src/widgets/header/ui/Header.tsx
'use client';

import { UserMenu } from '@/features/user-menu';
import { SearchBar } from '@/features/search';
import { Logo } from '@/shared/components/Logo';

export function Header() {
  return (
    <header>
      <Logo />
      <SearchBar />
      <UserMenu />
    </header>
  );
}
```

### Import Rules

✅ Allowed:
- `@/features/*`
- `@/entities/*`
- `@/shared/*`

❌ Not Allowed:
- `@/views/*` (upper layer)
- Other `@/widgets/*` (minimize widget-to-widget dependencies)

## 3. features/ - User Scenario Layer

### Role

- Implement user actions and scenarios
- Business logic + UI
- Use entity data to implement features

### Structure

```
src/features/
├── course-enrollment/
│   ├── ui/
│   │   └── EnrollmentButton.tsx
│   ├── model/
│   │   └── useEnrollment.ts
│   ├── api/
│   │   └── enrollCourse.ts
│   └── index.ts
├── user-menu/
│   ├── ui/
│   │   └── UserMenu.tsx
│   └── index.ts
└── search/
    ├── ui/
    │   └── SearchBar.tsx
    ├── model/
    │   └── useSearch.ts
    └── index.ts
```

### Example

```typescript
// src/features/course-enrollment/ui/EnrollmentButton.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/common/Button';
import { enrollCourse } from '../api/enrollCourse';

type Props = {
  courseId: string;
};

export function EnrollmentButton({ courseId }: Props) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    await enrollCourse(courseId);
    setIsEnrolling(false);
  };

  return (
    <Button onClick={handleEnroll} disabled={isEnrolling}>
      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
    </Button>
  );
}
```

```typescript
// src/features/course-enrollment/api/enrollCourse.ts
import { getCourse } from '@/entities/course';

export async function enrollCourse(courseId: string) {
  // Use entity to get course data
  const course = await getCourse(courseId);

  // Business logic
  const response = await fetch('/api/enrollments', {
    method: 'POST',
    body: JSON.stringify({ courseId, userId: 'current-user' }),
  });

  return response.json();
}
```

### Import Rules

✅ Allowed:
- `@/entities/*` (use data)
- `@/shared/*` (common UI/utils)

❌ Not Allowed:
- `@/views/*` (upper layer)
- `@/widgets/*` (upper layer)
- Other `@/features/*` (minimize feature-to-feature dependencies)

### Exception: Cross-Feature Communication

When communication between features is needed:

```typescript
// ⚠️ Instead of direct import, use shared/
// shared/events/courseEnrolled.ts
export const courseEnrolledEvent = new EventEmitter();

// features/course-enrollment/
import { courseEnrolledEvent } from '@/shared/events/courseEnrolled';

// features/notification/
import { courseEnrolledEvent } from '@/shared/events/courseEnrolled';
```

## 4. entities/ - Business Entity Layer

### Role

- Business domain models
- Data type definitions
- API calls and data management

### Structure

```
src/entities/
├── course/
│   ├── api/
│   │   ├── getCourses.ts
│   │   └── getCourse.ts
│   ├── model/
│   │   └── types.ts
│   ├── ui/
│   │   └── CourseCard.tsx
│   └── index.ts
└── user/
    ├── api/
    │   └── getUser.ts
    ├── model/
    │   └── types.ts
    └── index.ts
```

### Example

```typescript
// src/entities/course/model/types.ts
export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
};

// src/entities/course/api/getCourses.ts
import type { Course } from '../model/types';

export async function getCourses(): Promise<Course[]> {
  const response = await fetch('/api/courses');
  return response.json();
}

// src/entities/course/ui/CourseCard.tsx
import type { Course } from '../model/types';

type Props = {
  course: Course;
};

export function CourseCard({ course }: Props) {
  return (
    <div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <span>₩{course.price}</span>
    </div>
  );
}

// src/entities/course/index.ts
export { getCourses, getCourse } from './api/getCourses';
export { CourseCard } from './ui/CourseCard';
export type { Course } from './model/types';
```

### Import Rules

✅ Allowed:
- `@/shared/*`

❌ Not Allowed:
- `@/views/*`, `@/widgets/*`, `@/features/*` (upper layers)
- Other `@/entities/*` (entity-to-entity dependencies should be careful)

### Exception: Entity Relationships

When there are relationships between entities:

```typescript
// entities/course/model/types.ts
import type { User } from '@/entities/user';

export type Course = {
  id: string;
  title: string;
  instructor: User; // ✅ Type reference is OK
};

// entities/course/api/getCourseWithInstructor.ts
import { getUser } from '@/entities/user'; // ⚠️ Use carefully

export async function getCourseWithInstructor(id: string) {
  const course = await getCourse(id);
  const instructor = await getUser(course.instructorId);
  return { ...course, instructor };
}
```

## 5. shared/ - Common Utility Layer

### Role

- Pure utilities without business logic
- Reusable UI components
- Common types, helper functions

### Structure

```
src/shared/
├── components/
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/
│   ├── formatDate.ts
│   └── cn.ts
├── hooks/
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── types/
│   └── common.ts
└── config/
    └── api.ts
```

### Example

```typescript
// src/shared/components/common/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// src/shared/lib/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US');
}

// src/shared/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  // Implementation
}
```

### Import Rules

✅ Allowed:
- External libraries only (react, next, etc.)

❌ Not Allowed:
- All other FSD layers

## 6. app/ - Next.js Routing Layer (Outside FSD)

### Role

- Next.js App Router only
- File system routing
- Metadata, Layout definitions

### Structure

```
src/app/
├── layout.tsx
├── page.tsx           → @/views/home
├── dashboard/
│   └── page.tsx       → @/views/dashboard
└── api/
    └── courses/
        └── route.ts   → @/entities/course
```

### Import Rules

✅ Allowed:
- `@/views/*` (pages)
- `@/shared/*` (common utilities, types, etc.)

❌ Not Allowed:
- `@/widgets/*`, `@/features/*`, `@/entities/*`

**Recommendation**: Keep src/app/ as a thin routing layer by primarily importing from views, but shared types and constants can be used when needed

## Layer Dependency Rules Summary

```
src/app/    → views/ + shared/
views/      → widgets/ + features/ + entities/ + shared/
widgets/    → features/ + entities/ + shared/
features/   → entities/ + shared/
entities/   → shared/
shared/     → (External libraries)
```

## Slices and Segments

Each layer is divided into **Slices**:

```
features/
├── course-enrollment/    ← Slice
└── user-menu/            ← Slice
```

Each Slice consists of **Segments**:

```
features/course-enrollment/
├── ui/          ← UI Segment
├── model/       ← Model Segment (state, hooks)
├── api/         ← API Segment
└── index.ts     ← Public API
```

### Standard Segments:

- `ui/` - UI components
- `model/` - Business logic, hooks
- `api/` - API calls
- `lib/` - Utility functions
- `config/` - Configuration

### Public API (index.ts)

Each slice defines its external API with `index.ts`:

```typescript
// features/course-enrollment/index.ts
export { EnrollmentButton } from './ui/EnrollmentButton';
export { useEnrollment } from './model/useEnrollment';

// Internal implementation not exported
// - enrollCourse.ts (internal only)
```

## Practical Checklist

Verify your layer structure is correct:

- [ ] Do views/ only compose widgets/features?
- [ ] Are widgets/ independently reusable?
- [ ] Are features/ clear user scenarios?
- [ ] Are entities/ business domain models?
- [ ] Does shared/ have no business logic?
- [ ] Do upper layers only import from lower layers?
- [ ] Does each slice define public API with index.ts?

## Next Steps

- [Pages → Views Rename Reason](./pages-to-views.md)
- [App Router Integration](./app-router-integration.md)
- [React Compiler Setup](./react-compiler-setup.md)
- [Practical Examples](../../examples/v1.0-basic/)

## References

- [FSD Official Docs - Layers](https://feature-sliced.design/docs/reference/layers)
- [FSD Official Docs - Slices](https://feature-sliced.design/docs/reference/slices-segments)
