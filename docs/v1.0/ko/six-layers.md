# FSD 6계층 구조 완벽 가이드

## 개요

Feature-Sliced Design (FSD)는 프론트엔드 애플리케이션을 **6개의 계층**으로 나누어 구조화합니다. 각 계층은 명확한 책임을 가지며, **단방향 의존성 규칙**을 따릅니다.

```
views/      ← 페이지 컴포지션 (FSD의 pages, 이름 변경)
   ↓
widgets/    ← 독립적인 UI 블록
   ↓
features/   ← 사용자 시나리오
   ↓
entities/   ← 비즈니스 엔티티
   ↓
shared/     ← 공통 유틸리티
   ↓
(외부 라이브러리)
```

**핵심 규칙**: 상위 계층은 하위 계층만 import 가능 (역방향 불가)

## 1. views/ - 페이지 컴포지션 계층

### 역할

- widgets와 features를 조합하여 완전한 페이지 구성
- Next.js `app/`에서 import되는 실제 페이지
- 페이지 레벨 비즈니스 로직 포함 가능

### 구조

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

### 예제

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

### Import 규칙

✅ 가능:
- `@/widgets/*` - 위젯 조합
- `@/features/*` - 기능 사용
- `@/entities/*` - 엔티티 데이터
- `@/shared/*` - 공통 유틸

❌ 불가능:
- 다른 views import (페이지 간 의존성 금지)
- src/app/ import (Next.js 라우팅 계층)

## 2. widgets/ - 독립적 UI 블록 계층

### 역할

- 재사용 가능한 자립적 UI 블록
- features와 entities를 조합
- 여러 페이지에서 사용 가능

### 구조

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

### 예제

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

### Import 규칙

✅ 가능:
- `@/features/*`
- `@/entities/*`
- `@/shared/*`

❌ 불가능:
- `@/views/*` (상위 계층)
- 다른 `@/widgets/*` (위젯 간 의존성 최소화)

## 3. features/ - 사용자 시나리오 계층

### 역할

- 사용자 액션과 시나리오 구현
- 비즈니스 로직 + UI
- entities의 데이터를 사용하여 기능 구현

### 구조

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

### 예제

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

### Import 규칙

✅ 가능:
- `@/entities/*` (데이터 사용)
- `@/shared/*` (공통 UI/유틸)

❌ 불가능:
- `@/views/*` (상위 계층)
- `@/widgets/*` (상위 계층)
- 다른 `@/features/*` (기능 간 의존성 최소화)

### 예외: Cross-Feature Communication

기능 간 통신이 필요할 때:

```typescript
// ⚠️ 직접 import 대신 shared/를 통해
// shared/events/courseEnrolled.ts
export const courseEnrolledEvent = new EventEmitter();

// features/course-enrollment/
import { courseEnrolledEvent } from '@/shared/events/courseEnrolled';

// features/notification/
import { courseEnrolledEvent } from '@/shared/events/courseEnrolled';
```

## 4. entities/ - 비즈니스 엔티티 계층

### 역할

- 비즈니스 도메인 모델
- 데이터 타입 정의
- API 호출 및 데이터 관리

### 구조

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

### 예제

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

### Import 규칙

✅ 가능:
- `@/shared/*`

❌ 불가능:
- `@/views/*`, `@/widgets/*`, `@/features/*` (상위 계층)
- 다른 `@/entities/*` (엔티티 간 의존성은 신중히)

### 예외: Entity Relationships

엔티티 간 관계가 있을 때:

```typescript
// entities/course/model/types.ts
import type { User } from '@/entities/user';

export type Course = {
  id: string;
  title: string;
  instructor: User; // ✅ 타입 참조는 OK
};

// entities/course/api/getCourseWithInstructor.ts
import { getUser } from '@/entities/user'; // ⚠️ 신중히 사용

export async function getCourseWithInstructor(id: string) {
  const course = await getCourse(id);
  const instructor = await getUser(course.instructorId);
  return { ...course, instructor };
}
```

## 5. shared/ - 공통 유틸리티 계층

### 역할

- 비즈니스 로직이 없는 순수 유틸리티
- 재사용 가능한 UI 컴포넌트
- 공통 타입, 헬퍼 함수

### 구조

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

### 예제

```typescript
// src/shared/components/common/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// src/shared/lib/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR');
}

// src/shared/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  // Implementation
}
```

### Import 규칙

✅ 가능:
- 외부 라이브러리만 (react, next, etc.)

❌ 불가능:
- 다른 모든 FSD 계층

## 6. app/ - Next.js 라우팅 계층 (FSD 외부)

### 역할

- Next.js App Router 전용
- 파일 시스템 라우팅
- Metadata, Layout 정의

### 구조

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

### Import 규칙

✅ 가능:
- `@/views/*` (페이지)
- `@/shared/*` (공통 유틸리티, 타입 등)

❌ 불가능:
- `@/widgets/*`, `@/features/*`, `@/entities/*`

**권장사항**: src/app/은 얇은 라우팅 레이어로 유지하기 위해 주로 views만 import하되, 필요시 shared의 타입이나 상수는 사용 가능

## 계층 간 의존성 규칙 요약

```
src/app/    → views/ + shared/
views/      → widgets/ + features/ + entities/ + shared/
widgets/    → features/ + entities/ + shared/
features/   → entities/ + shared/
entities/   → shared/
shared/     → (외부 라이브러리)
```

## Slices와 Segments

각 계층 내부는 **Slices**로 나뉩니다:

```
features/
├── course-enrollment/    ← Slice
└── user-menu/            ← Slice
```

각 Slice는 **Segments**로 구성됩니다:

```
features/course-enrollment/
├── ui/          ← UI Segment
├── model/       ← Model Segment (state, hooks)
├── api/         ← API Segment
└── index.ts     ← Public API
```

### 표준 Segments:

- `ui/` - UI 컴포넌트
- `model/` - 비즈니스 로직, hooks
- `api/` - API 호출
- `lib/` - 유틸리티 함수
- `config/` - 설정

### Public API (index.ts)

각 slice는 `index.ts`로 외부 API를 정의합니다:

```typescript
// features/course-enrollment/index.ts
export { EnrollmentButton } from './ui/EnrollmentButton';
export { useEnrollment } from './model/useEnrollment';

// Internal implementation은 export하지 않음
// - enrollCourse.ts (내부 전용)
```

## 실전 체크리스트

계층 구조가 올바른지 확인:

- [ ] views/는 widgets/features만 조합하는가?
- [ ] widgets/는 독립적으로 재사용 가능한가?
- [ ] features/는 명확한 사용자 시나리오인가?
- [ ] entities/는 비즈니스 도메인 모델인가?
- [ ] shared/는 비즈니스 로직이 없는가?
- [ ] 상위 계층이 하위 계층만 import하는가?
- [ ] 각 slice는 index.ts로 public API를 정의하는가?

## 다음 단계

- [Pages → Views 변경 이유](./pages-to-views.md)
- [App Router 통합](./app-router-integration.md)
- [React Compiler 설정](./react-compiler-setup.md)
- [실전 예제](../../examples/v1.0-basic/)

## 참고 자료

- [FSD 공식 문서 - Layers](https://feature-sliced.design/docs/reference/layers)
- [FSD 공식 문서 - Slices](https://feature-sliced.design/docs/reference/slices-segments)
