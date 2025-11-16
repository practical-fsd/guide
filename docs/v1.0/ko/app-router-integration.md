# App Router와 FSD 통합 가이드

## 문제 (The Problem)

Next.js 15 App Router는 강력한 기능들을 제공하지만, Feature-Sliced Design과 함께 사용할 때 다음과 같은 질문들이 생깁니다:

- **Layouts**: 어디에 위치해야 하나? `app/`? `widgets/`? `views/`?
- **Server Components**: FSD 어느 계층에서 사용할 수 있나?
- **Metadata**: 페이지 메타데이터는 어디서 관리하나?
- **Route Handlers**: API 엔드포인트는 FSD 구조에 어떻게 맞추나?
- **Loading/Error States**: 로딩과 에러 UI는 어느 계층에?

### 실제 프로젝트에서 겪은 혼란:

```typescript
// ❌ 잘못된 예: 모든 로직이 app/에 집중
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await fetchUser();  // API 호출
  const courses = await fetchCourses();  // API 호출

  return (
    <div>
      <Header user={user} />  // UI 로직
      <CourseList courses={courses} />  // UI 로직
    </div>
  );
}
```

**문제점**: FSD 계층 구조를 무시하고 `app/`에 모든 것을 넣음

## 해결책 (Our Solution)

**App Router의 각 기능을 FSD 계층에 명확히 매핑**

| Next.js 기능 | FSD 위치 | 역할 |
|-------------|---------|-----|
| 라우팅 (page.tsx) | `app/` | 라우팅만, views/에서 import |
| Layout (root) | `app/layout.tsx` | 앱 전체 레이아웃 |
| Layout (section) | `widgets/` | 특정 섹션 레이아웃 |
| Metadata | `app/` | SEO 메타데이터 |
| Route Handlers | `app/api/` | API 프록시 (entities로 위임) |
| Server Actions | `features/` | 비즈니스 로직 |
| Loading | `app/loading.tsx` (전역), `views/` (페이지별) |
| Error | `app/error.tsx` (전역), `views/` (페이지별) |

## 구현 방법 (Implementation)

### 1. 기본 라우팅 구조

```
src/app/
├── layout.tsx          ← 루트 레이아웃
├── page.tsx            ← 홈 (views/home 사용)
├── loading.tsx         ← 글로벌 로딩
├── error.tsx           ← 글로벌 에러
│
├── dashboard/
│   ├── page.tsx        ← 대시보드 (views/dashboard 사용)
│   ├── layout.tsx      ← 대시보드 레이아웃
│   └── loading.tsx     ← 대시보드 로딩
│
├── courses/
│   ├── page.tsx        ← 코스 목록
│   └── [id]/
│       └── page.tsx    ← 코스 상세 (동적)
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
    <html lang="ko">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  );
}
```

**역할:**
- ✅ HTML shell (`<html>`, `<body>`)
- ✅ 글로벌 스타일
- ✅ 폰트 설정
- ✅ 기본 메타데이터
- ❌ 비즈니스 로직

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

**패턴:**
- `app/layout.tsx`: metadata + import
- `widgets/layouts/`: 실제 레이아웃 구현

### 4. 페이지와 Metadata

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

**패턴:**
- Metadata 생성: `app/` (Next.js 기능)
- 페이지 렌더링: `views/` (FSD 계층)

### 5. Server Components와 Client Components

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

**FSD 계층별 Server/Client Component 사용:**

| 계층 | Server Component | Client Component |
|-----|-----------------|------------------|
| `views/` | ✅ 페이지 데이터 로딩 | ✅ 인터랙티브 페이지 |
| `widgets/` | ✅ 정적 섹션 | ✅ 인터랙티브 위젯 |
| `features/` | ⚠️ 드물게 | ✅ 대부분 (사용자 시나리오) |
| `entities/` | ✅ API 호출 유틸 | ✅ UI 컴포넌트 |
| `shared/` | ❌ 거의 없음 | ✅ UI 컴포넌트 |

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

**패턴:**
- `app/api/route.ts`: Next.js Route Handler (얇은 프록시)
- `entities/*/api/`: 실제 API 호출 로직

### 7. Loading과 Error States

#### 글로벌 Loading/Error

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

#### 페이지별 Loading/Error (views/)

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

**패턴:**
- 글로벌: `app/loading.tsx`, `app/error.tsx`
- 페이지별: `views/*/ui/*Skeleton.tsx`, `views/*/ui/*Error.tsx`

### 8. 병렬 라우팅과 인터셉팅

```
src/app/
└── dashboard/
    ├── @modal/           ← 병렬 라우트
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

**패턴:**
- 라우팅 구조: `app/`
- 실제 UI: `views/`, `widgets/`

## 교훈 (Lessons Learned)

### 프로덕션 경험:

**✅ 잘 작동한 패턴:**

1. **app/ = 라우팅 전용**: 5-10줄 이하 유지
2. **Metadata는 app/**: SEO는 Next.js에 맡기기
3. **Server Components in views/**: 초기 데이터 로딩 성능 향상
4. **Layout은 widgets/**: 재사용 가능한 레이아웃

**⚠️ 피해야 할 패턴:**

1. **app/에 비즈니스 로직**: 테스트 어려움, FSD 위반
2. **모든 것을 Client Component로**: 성능 저하
3. **Route Handler에 복잡한 로직**: entities/에 위임해야 함

### 성능 개선 사례:

```typescript
// ❌ Before: 모든 것이 Client Component
'use client';

export function DashboardPage() {
  const { user } = useUser();  // Client-side fetch
  const { courses } = useCourses();  // Client-side fetch

  return <div>...</div>;  // 로딩 중 빈 화면
}

// ✅ After: Server Component로 초기 데이터 로딩
export async function DashboardPage() {
  const user = await getUser();  // Server-side
  const courses = await getCourses();  // Server-side

  return <div>...</div>;  // 즉시 렌더링
}
```

**결과**: First Contentful Paint 40% 개선

## 실전 체크리스트

App Router와 FSD 통합이 올바른지 확인:

- [ ] `src/app/page.tsx`는 10줄 이하인가?
- [ ] Metadata는 `src/app/`에서만 정의하는가?
- [ ] Layout 구현은 `widgets/layouts/`에 있는가?
- [ ] Route Handlers는 `entities/`로 위임하는가?
- [ ] Server Components를 적극 활용하는가?
- [ ] Loading/Error states가 적절한 계층에 있는가?

## 다음 단계

- [6계층 구조 상세](./six-layers.md) - 각 계층의 역할과 책임
- [React Compiler 설정](./react-compiler-setup.md) - 성능 최적화
- [실전 예제](../../examples/v1.0-basic/) - 전체 구조 예제

## 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [FSD 공식 문서](https://feature-sliced.design/)
