# Pages → Views: Integrating Next.js App Router with FSD

> [한국어](../ko/pages-to-views.md) | **English**

## The Problem

The official Feature-Sliced Design (FSD) documentation defines the top layer in a 6-layer structure as `pages/`. However, Next.js 13+ App Router uses the `app/` folder for file-system routing.

```
❌ Conflicting structure:
project/
└── src/
    ├── app/       ← Next.js routing
    ├── pages/     ← FSD top layer (Conflict!)
    ├── widgets/
    └── ...
```

### Real Problems We Faced:

1. **Next.js conflict**: The `pages/` directory is reserved for Next.js Pages Router and cannot be used
2. **Code duplication**: Routing logic and page logic weren't properly separated
3. **FSD violations**: Putting business logic in `src/app/page.tsx` breaks FSD layer rules
4. **Maintenance difficulties**: Unclear where to write what

## Our Solution

**Rename FSD's `pages/` layer to `views/`**

```
✅ Clear structure:
project/
└── src/
    ├── app/          ← Routing only (thin layer)
    │   ├── page.tsx  → imports from views/home
    │   └── about/
    │       └── page.tsx  → imports from views/about
    ├── views/        ← Page composition (FSD's pages)
    │   ├── home/
    │   └── about/
    ├── widgets/
    ├── features/
    ├── entities/
    └── shared/
```

### Core Principles:

1. **`src/app/` = Routing Layer**: File-system routing, metadata, layouts only
2. **`views/` = Page Layer**: Actual page logic, composing widgets/features
3. **Clear responsibilities**: Each folder has a well-defined purpose

## Implementation

### Step 1: Project Structure Setup

```bash
project/
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── dashboard/
    │       └── page.tsx
    ├── views/
    │   ├── home/
    │   │   ├── ui/
    │   │   │   └── HomePage.tsx
    │   │   └── index.ts
    │   └── dashboard/
    │       ├── ui/
    │       │   └── DashboardPage.tsx
    │       └── index.ts
    ├── widgets/
    ├── features/
    ├── entities/
    └── shared/
```

### Step 2: app/ - Routing Layer (Thin Layer)

```typescript
// src/app/page.tsx
// Routing layer - only imports from views/
import { HomePage } from '@/views/home';

export default HomePage;
```

```typescript
// src/app/dashboard/page.tsx
// Routing layer - handles Next.js specific concerns
import { DashboardPage } from '@/views/dashboard';

export const metadata = {
  title: 'Dashboard',
  description: 'User dashboard',
};

export default DashboardPage;
```

**src/app/ responsibilities:**
- ✅ File-system routing
- ✅ Metadata definition
- ✅ Layout definition
- ✅ Route Handlers (API)
- ❌ Business logic (strictly prohibited!)

### Step 3: views/ - Page Composition Layer

```typescript
// src/views/home/ui/HomePage.tsx
'use client';

import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CourseList } from '@/features/course-list';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16">
          <h1 className="text-4xl font-bold text-center">
            Welcome to LABS
          </h1>
          <p className="text-center text-gray-600 mt-4">
            Learn with the best online courses
          </p>
        </section>

        <CourseList />
      </main>

      <Footer />
    </div>
  );
}
```

```typescript
// src/views/home/index.ts
// Public API - only export what's needed
export { HomePage } from './ui/HomePage';
```

**views/ responsibilities:**
- ✅ Compose widgets + features
- ✅ Page-level layout
- ✅ Page-level business logic
- ✅ Choose Client/Server Component
- ❌ Direct API calls (handled by entities/features)

### Step 4: Dynamic Routing with views/

```typescript
// src/app/courses/[id]/page.tsx
// Dynamic routing - still a thin layer
import { CourseDetailPage } from '@/views/course-detail';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <CourseDetailPage courseId={id} />;
}
```

```typescript
// src/views/course-detail/ui/CourseDetailPage.tsx
'use client';

import { useCourse } from '@/entities/course';
import { EnrollmentButton } from '@/features/course-enrollment';

type Props = {
  courseId: string;
};

export function CourseDetailPage({ courseId }: Props) {
  const { course, isLoading } = useCourse(courseId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <EnrollmentButton courseId={courseId} />
    </div>
  );
}
```

## Lessons Learned

### Production Results:

**✅ What Worked Well:**

1. **Clear separation**: Even junior developers immediately understood where to write code
2. **Efficient code reviews**: Business logic in `app/` is instantly flagged
3. **Testability**: `views/` are pure React components, easy to test
4. **Easy migrations**: Next.js version upgrades only require `app/` changes

**⚠️ Watch Out For:**

1. **Team convention required**: The whole team must understand why we changed `pages/` to `views/`
2. **Documentation is key**: Since this differs from official FSD, internal docs are essential
3. **Server Components consideration**: Be careful when using Server Components in `views/`
4. **Import paths**: Use `@/views/` consistently

### Actual Team Feedback:

> "At first, `views/` felt unfamiliar, but after 2 weeks, the difference between `src/app/` and `views/` became crystal clear. It's actually more intuitive than FSD's official `pages/`." - Frontend Developer

> "Keeping `src/app/page.tsx` under 5 lines makes understanding the routing structure much faster." - Team Lead

## Comparison: Alternative Approaches

### Approach 1: FSD structure inside app/

```
❌ Not recommended:
src/app/
├── _pages/        ← FSD inside app
├── _widgets/
└── page.tsx
```

**Problems**: `src/app/` folder becomes bloated, Next.js routing and FSD get mixed

### Approach 2: Keep pages/ as-is

```
⚠️ Confusing:
src/app/           ← Routing
src/pages/     ← FSD layer
```

**Problems**: Developers confuse the two `pages`

### Approach 3: Use views/ (Our Choice)

```
✅ Recommended:
src/app/           ← Routing (Next.js terminology)
src/views/     ← Pages (FSD composition)
```

**Benefits**: Clear separation of concerns, no conceptual conflicts

## Checklist

Verify that the views/ layer is correctly implemented:

- [ ] Is `app/page.tsx` under 10 lines?
- [ ] Is there no business logic in `app/page.tsx`?
- [ ] Does each `views/` page compose widgets/features?
- [ ] Is `views/` public API defined in `index.ts`?
- [ ] Are Server Components clearly marked when needed?

## Next Steps

- [App Router Integration Guide](./app-router-integration.md) - Detailed app/ and views/ integration
- [6-Layer Architecture Details](./six-layers.md) - Understanding all FSD layers
- [Real Example Code](../../examples/v1.0-basic/) - See working code

## References

- [FSD Official Docs - Pages Layer](https://feature-sliced.design/docs/reference/layers#pages)
- [Next.js App Router](https://nextjs.org/docs/app)
