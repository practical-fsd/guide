# Pages → Views: Next.js App Router와 FSD 통합하기

## 문제 (The Problem)

Feature-Sliced Design (FSD) 공식 문서는 6계층 구조에서 최상위 계층을 `pages/`로 정의합니다. 하지만 Next.js 13+ App Router는 `app/` 폴더를 파일 시스템 라우팅에 사용합니다.

```
❌ 충돌하는 구조:
project/
└── src/
    ├── app/       ← Next.js 라우팅
    ├── pages/     ← FSD 최상위 계층 (충돌!)
    ├── widgets/
    └── ...
```

### 실제로 마주한 문제들:

1. **Next.js 충돌**: `pages/` 디렉토리는 Next.js Pages Router 전용으로 예약되어 사용 불가
2. **코드 중복**: 라우팅 로직과 페이지 로직이 분리되지 않음
3. **FSD 위반**: `src/app/page.tsx`에 비즈니스 로직을 넣으면 FSD 계층 규칙 위반
4. **유지보수 어려움**: 어디에 무엇을 작성해야 할지 명확하지 않음

## 해결책 (Our Solution)

**FSD의 `pages/` 계층을 `views/`로 이름 변경**

```
✅ 명확한 구조:
project/
└── src/
    ├── app/          ← 라우팅만 담당 (thin layer)
    │   ├── page.tsx  → views/home에서 import
    │   └── about/
    │       └── page.tsx  → views/about에서 import
    ├── views/        ← 페이지 컴포지션 (FSD의 pages)
    │   ├── home/
    │   └── about/
    ├── widgets/
    ├── features/
    ├── entities/
    └── shared/
```

### 핵심 원칙:

1. **`app/` = 라우팅 레이어**: 파일 시스템 라우팅, metadata, layout만
2. **`views/` = 페이지 레이어**: 실제 페이지 로직, widgets/features 조합
3. **명확한 역할 분리**: 각 폴더의 책임이 명확함

## 구현 방법 (Implementation)

### Step 1: 프로젝트 구조 설정

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

### Step 2: app/ - 라우팅 레이어 (Thin Layer)

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

**app/의 역할:**
- ✅ 파일 시스템 라우팅
- ✅ Metadata 정의
- ✅ Layout 정의
- ✅ Route Handlers (API)
- ❌ 비즈니스 로직 (절대 금지!)

### Step 3: views/ - 페이지 컴포지션 레이어

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

**views/의 역할:**
- ✅ widgets + features 조합
- ✅ 페이지 레벨 레이아웃
- ✅ 페이지 수준 비즈니스 로직
- ✅ Client/Server Component 선택
- ❌ 직접적인 API 호출 (entities/features에서 처리)

### Step 4: 동적 라우팅과 views/

```typescript
// src/app/courses/[id]/page.tsx
// Dynamic routing - still thin layer
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

## 교훈 (Lessons Learned)

### 프로덕션 운영 결과:

**✅ 잘 된 점:**

1. **명확한 역할 분리**: 신입 개발자도 어디에 코드를 작성할지 바로 이해
2. **코드 리뷰 효율**: `app/`에 비즈니스 로직이 있으면 바로 지적 가능
3. **테스트 용이**: `views/`는 순수 React 컴포넌트라 테스트 쉬움
4. **마이그레이션 쉬움**: Next.js 버전 업그레이드 시 `app/`만 수정

**⚠️ 주의할 점:**

1. **팀 컨벤션 필수**: `pages/`를 `views/`로 바꾼 이유를 팀 전체가 이해해야 함
2. **문서화 중요**: FSD 공식 문서와 다르므로 내부 문서 필수
3. **Server Components 고려**: `views/`에서 Server Component 사용 시 주의
4. **Import 경로**: `@/views/`로 일관성 있게 사용

### 실제 팀 피드백:

> "처음에는 `views/`가 낯설었지만, 2주 후에는 `app/`과 `views/`의 차이가 명확해졌어요. 오히려 FSD 공식 `pages/`보다 직관적입니다." - 프론트엔드 개발자

> "`app/page.tsx`가 5줄 이하로 유지되니까 라우팅 구조 파악이 빨라졌습니다." - 팀 리드

## 비교: 다른 접근 방식들

### 방법 1: app/ 내부에 FSD 구조

```
❌ 비추천:
app/
├── _pages/        ← app 내부에 FSD
├── _widgets/
└── page.tsx
```

**문제점**: `app/` 폴더가 비대해지고, Next.js 라우팅과 FSD가 뒤섞임

### 방법 2: pages/ 그대로 사용

```
⚠️ 혼란스러움:
app/           ← 라우팅
src/pages/     ← FSD 계층
```

**문제점**: 개발자들이 두 `pages`의 차이를 혼동

### 방법 3: views/ 사용 (우리의 선택)

```
✅ 추천:
app/           ← 라우팅 (Next.js 용어)
src/views/     ← 페이지 (FSD 컴포지션)
```

**장점**: 명확한 역할 분리, 개념적 충돌 없음

## 체크리스트

views/ 계층이 올바르게 구현되었는지 확인:

- [ ] `app/page.tsx`는 10줄 이하인가?
- [ ] `app/page.tsx`에 비즈니스 로직이 없는가?
- [ ] `views/`의 각 페이지는 widgets/features를 조합하는가?
- [ ] `views/`의 public API가 `index.ts`로 정의되어 있는가?
- [ ] Server Component가 필요한 경우 명확히 표시했는가?

## 다음 단계

- [App Router 통합 가이드](./app-router-integration.md) - app/과 views/ 상세 통합 방법
- [6계층 구조 상세](./six-layers.md) - 전체 FSD 계층 이해하기
- [실전 예제 코드](../../examples/v1.0-basic/) - 실제 작동하는 코드 보기

## 참고 자료

- [FSD 공식 문서 - Pages Layer](https://feature-sliced.design/docs/reference/layers#pages)
- [Next.js App Router](https://nextjs.org/docs/app)
- [우리의 결정 과정](../../docs/v1.0/case-study/architectural-decisions.md) (작성 예정)
