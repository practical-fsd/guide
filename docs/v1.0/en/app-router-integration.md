# App Router and FSD Integration Guide

> [한국어](../ko/app-router-integration.md) | **English**

## The Problem

Next.js 15 App Router provides powerful features, but when used with Feature-Sliced Design, questions arise:

- **Layouts**: Where should they be located? `src/app/`? `widgets/`? `views/`?
- **Server Components**: Which FSD layer can use them?
- **Metadata**: Where should page metadata be managed?
- **Route Handlers**: How do API endpoints fit into the FSD structure?
- **Loading/Error States**: Which layer should handle loading and error UI?

### Confusion Experienced in Real Projects:

```typescript
// ❌ Wrong example: All logic concentrated in app/
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await fetchUser();  // API call
  const courses = await fetchCourses();  // API call

  return (
    <div>
      <Header user={user} />  // UI logic
      <CourseList courses={courses} />  // UI logic
    </div>
  );
}
```

**Problem**: Ignores FSD layer structure and puts everything in `src/app/`

## Our Solution

**Clear mapping of each App Router feature to FSD layers**

| Next.js Feature | FSD Location | Role |
|----------------|-------------|------|
| Routing (page.tsx) | `src/app/` | Routing only, import from views/ |
| Layout (root) | `src/app/layout.tsx` | App-wide layout |
| Layout (section) | `widgets/` | Specific section layout |
| Metadata | `src/app/` | SEO metadata |
| Route Handlers | `src/app/api/` | API proxy (delegate to entities) |
| Server Actions | `features/` | Business logic |
| Loading | `src/app/loading.tsx` (global), `views/` (per-page) |
| Error | `src/app/error.tsx` (global), `views/` (per-page) |

## Implementation

### 1. Basic Routing Structure

```
src/app/
├── layout.tsx          ← Root layout
├── page.tsx            ← Home (uses views/home)
├── loading.tsx         ← Global loading
├── error.tsx           ← Global error
│
├── dashboard/
│   ├── page.tsx        ← Dashboard (uses views/dashboard)
│   ├── layout.tsx      ← Dashboard layout
│   └── loading.tsx     ← Dashboard loading
│
├── courses/
│   ├── page.tsx        ← Course list
│   └── [id]/
│       └── page.tsx    ← Course detail (dynamic)
│
└── api/
    └── courses/
        └── route.ts    ← API Route Handler
```

### 2. Root Layout (app/layout.tsx)

```typescript
// src/app/layout.tsx
// Global layout - provides app shell
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | LABS',
    default: 'LABS - Learn Advanced Business Skills',
  },
  description: 'Enterprise learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  );
}
```

**Responsibilities:**
- ✅ HTML shell (`<html>`, `<body>`)
- ✅ Global styles
- ✅ Font configuration
- ✅ Default metadata
- ❌ Business logic

### 3. Section Layout (app/dashboard/layout.tsx)

```typescript
// src/app/dashboard/layout.tsx
// Dashboard section layout
import { DashboardLayout } from '@/widgets/layouts/dashboard';

export const metadata = {
  title: 'Dashboard',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

```typescript
// src/widgets/layouts/dashboard/ui/DashboardLayout.tsx
// Actual layout implementation in widgets/
'use client';

import { DashboardSidebar } from '@/widgets/dashboard-sidebar';
import { DashboardHeader } from '@/widgets/dashboard-header';

type Props = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Pattern:**
- `src/app/layout.tsx`: metadata + import
- `widgets/layouts/`: actual layout implementation

### 4. Pages and Metadata

```typescript
// src/app/courses/[id]/page.tsx
// Page with dynamic route and metadata
import { CourseDetailPage } from '@/views/course-detail';
import { getCourse } from '@/entities/course/api';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourse(id);

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.thumbnail],
    },
  };
}

// Page component
export default async function Page({ params }: Props) {
  const { id } = await params;
  return <CourseDetailPage courseId={id} />;
}
```

**Pattern:**
- Metadata generation: `src/app/` (Next.js feature)
- Page rendering: `views/` (FSD layer)

### 5. Server Components and Client Components

```typescript
// src/views/dashboard/ui/DashboardPage.tsx
// Server Component (default in App Router)
import { getCurrentUser } from '@/entities/user/api';
import { EnrolledCourses } from '@/features/enrolled-courses';
import { RecentActivity } from '@/widgets/recent-activity';

export async function DashboardPage() {
  // Server-side data fetching
  const user = await getCurrentUser();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      {/* Client component for interactivity */}
      <EnrolledCourses userId={user.id} />

      {/* Server component (no interactivity needed) */}
      <RecentActivity userId={user.id} />
    </div>
  );
}
```

```typescript
// src/features/enrolled-courses/ui/EnrolledCourses.tsx
// Client Component for interactivity
'use client';

import { useCourses } from '@/entities/course';
import { CourseCard } from '@/entities/course/ui';
import { useState } from 'react';

type Props = {
  userId: string;
};

export function EnrolledCourses({ userId }: Props) {
  const [filter, setFilter] = useState('all');
  const { courses, isLoading } = useCourses(userId, filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Server/Client Component Usage by FSD Layer:**

| Layer | Server Component | Client Component |
|-------|-----------------|------------------|
| `views/` | ✅ Page data loading | ✅ Interactive pages |
| `widgets/` | ✅ Static sections | ✅ Interactive widgets |
| `features/` | ⚠️ Rarely | ✅ Mostly (user scenarios) |
| `entities/` | ✅ API utility | ✅ UI components |
| `shared/` | ❌ Almost never | ✅ UI components |

### 6. Route Handlers (API Routes)

```typescript
// src/app/api/courses/route.ts
// Thin API proxy - delegates to entities
import { NextResponse } from 'next/server';
import { getCourseList } from '@/entities/course/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Delegate to entity layer
    const courses = await getCourseList({ category });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
```

```typescript
// src/entities/course/api/getCourseList.ts
// Actual API implementation
type Params = {
  category?: string | null;
};

export async function getCourseList(params: Params) {
  const url = new URL(`${process.env.API_BASE_URL}/courses`);

  if (params.category) {
    url.searchParams.set('category', params.category);
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return response.json();
}
```

**Pattern:**
- `src/app/api/route.ts`: Next.js Route Handler (thin proxy)
- `entities/*/api/`: Actual API call logic

### 7. Loading and Error States

#### Global Loading/Error

```typescript
// src/app/loading.tsx
// Global loading fallback
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
    </div>
  );
}
```

```typescript
// src/app/error.tsx
// Global error boundary
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

#### Per-Page Loading/Error (views/)

```typescript
// src/views/course-detail/ui/CourseDetailPage.tsx
'use client';

import { useCourse } from '@/entities/course';
import { CourseDetailSkeleton } from './CourseDetailSkeleton';
import { CourseDetailError } from './CourseDetailError';

type Props = {
  courseId: string;
};

export function CourseDetailPage({ courseId }: Props) {
  const { course, isLoading, error } = useCourse(courseId);

  if (isLoading) {
    return <CourseDetailSkeleton />;
  }

  if (error) {
    return <CourseDetailError error={error} />;
  }

  return (
    <div>
      <h1>{course.title}</h1>
      {/* ... */}
    </div>
  );
}
```

**Pattern:**
- Global: `src/app/loading.tsx`, `src/app/error.tsx`
- Per-page: `views/*/ui/*Skeleton.tsx`, `views/*/ui/*Error.tsx`

### 8. Parallel Routes and Intercepting

```
src/app/
└── dashboard/
    ├── @modal/           ← Parallel route
    │   ├── (..)login/
    │   │   └── page.tsx
    │   └── default.tsx
    ├── layout.tsx
    └── page.tsx
```

```typescript
// src/app/dashboard/layout.tsx
// Parallel routes layout
export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

```typescript
// src/app/dashboard/@modal/(..)login/page.tsx
// Intercepted route - delegates to views/
import { LoginModal } from '@/views/login-modal';

export default function InterceptedLoginPage() {
  return <LoginModal />;
}
```

**Pattern:**
- Routing structure: `src/app/`
- Actual UI: `views/`, `widgets/`

## Lessons Learned

### Production Experience:

**✅ Patterns That Worked Well:**

1. **app/ = Routing only**: Keep under 5-10 lines
2. **Metadata in app/**: Let Next.js handle SEO
3. **Server Components in views/**: Improved initial data loading performance
4. **Layouts in widgets/**: Reusable layouts

**⚠️ Patterns to Avoid:**

1. **Business logic in app/**: Difficult to test, violates FSD
2. **Everything as Client Component**: Performance degradation
3. **Complex logic in Route Handlers**: Should delegate to entities/

### Performance Improvement Case:

```typescript
// ❌ Before: Everything is Client Component
'use client';

export function DashboardPage() {
  const { user } = useUser();  // Client-side fetch
  const { courses } = useCourses();  // Client-side fetch

  return <div>...</div>;  // Empty screen during loading
}

// ✅ After: Server Component for initial data loading
export async function DashboardPage() {
  const user = await getUser();  // Server-side
  const courses = await getCourses();  // Server-side

  return <div>...</div>;  // Renders immediately
}
```

**Result**: 40% improvement in First Contentful Paint

## Practical Checklist

Verify your App Router and FSD integration:

- [ ] Is `src/app/page.tsx` under 10 lines?
- [ ] Is metadata only defined in `src/app/`?
- [ ] Are layout implementations in `widgets/layouts/`?
- [ ] Do Route Handlers delegate to `entities/`?
- [ ] Are you actively using Server Components?
- [ ] Are Loading/Error states in appropriate layers?

## Next Steps

- [6-Layer Structure Details](./six-layers.md) - Roles and responsibilities of each layer
- [React Compiler Setup](./react-compiler-setup.md) - Performance optimization
- [Practical Examples](../../examples/v1.0-basic/) - Complete structure examples

## References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [FSD Official Docs](https://feature-sliced.design/)
