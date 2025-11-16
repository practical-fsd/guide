# Practical FSD v1.0 - Basic Example

> [English](./README.md) | **한국어**

이 예제는 **Next.js 15 + FSD v1.0 아키텍처**의 기본 구조를 보여줍니다.

## 주요 특징

- ✅ Next.js 15.5.4 + App Router
- ✅ React 19.1.0
- ✅ React Compiler 활성화
- ✅ FSD 6계층 구조 (`pages` → `views`)
- ✅ TypeScript Path Aliases
- ✅ Tailwind CSS 4

## 프로젝트 구조

```
v1.0-basic/
└── src/
    ├── app/                # Next.js App Router (라우팅 전용)
    │   ├── layout.tsx      # 루트 레이아웃
    │   ├── page.tsx        # 홈 (→ views/home)
    │   └── dashboard/
    │       └── page.tsx    # 대시보드 (→ views/dashboard)
    │
    ├── views/              # 페이지 컴포지션 (FSD의 pages)
    │   ├── home/
    │   │   ├── ui/
    │   │   │   └── HomePage.tsx
    │   │   └── index.ts
    │   └── dashboard/
    │       └── ui/
    │           └── DashboardPage.tsx
    │
    ├── widgets/            # 독립적 UI 블록
    │   ├── header/
    │   │   ├── ui/
    │   │   │   └── Header.tsx
    │   │   └── index.ts
    │   └── footer/
    │
    ├── features/           # 사용자 시나리오
    │   └── course-list/
    │       ├── ui/
    │       │   └── CourseList.tsx
    │       └── index.ts
    │
    ├── entities/           # 비즈니스 엔티티
    │   └── course/
    │       ├── api/
    │       │   └── getCourses.ts
    │       ├── model/
    │       │   └── types.ts
    │       └── index.ts
    │
    └── shared/             # 공통 유틸리티
        ├── components/
        │   └── common/
        │       ├── Button.tsx
        │       └── Input.tsx
        ├── lib/
        ├── hooks/
        └── types/
```

## 핵심 개념

### 1. app/ = 라우팅 전용

```typescript
// src/app/page.tsx
// ✅ Thin routing layer - only imports from views/
import { HomePage } from '@/views/home';

export default HomePage;
```

### 2. views/ = 페이지 컴포지션

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

### 3. FSD 계층 규칙

```
views/     → widgets/ + features/
widgets/   → features/ + entities/
features/  → entities/ + shared/
entities/  → shared/
shared/    → (외부 라이브러리만)
```

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

http://localhost:3000 열기

## 학습 경로

1. [pages → views 변경 이유](../../docs/v1.0/ko/pages-to-views.md)
2. [App Router 통합 가이드](../../docs/v1.0/ko/app-router-integration.md)
3. [6계층 구조 상세](../../docs/v1.0/ko/six-layers.md)

## 주요 파일 살펴보기

| 파일 | 역할 | 설명 |
|-----|------|-----|
| `src/app/page.tsx` | 라우팅 | views/home import만 |
| `src/views/home/` | 페이지 | widgets/features 조합 |
| `src/widgets/header/` | 위젯 | 재사용 가능한 UI 블록 |
| `src/features/course-list/` | 기능 | 사용자 시나리오 |
| `src/entities/course/` | 엔티티 | 비즈니스 데이터 |
| `src/shared/components/` | 공통 | UI 컴포넌트 |

## 더 알아보기

- [Next.js 15 문서](https://nextjs.org/docs)
- [FSD 공식 문서](https://feature-sliced.design/)
- [React Compiler](https://react.dev/learn/react-compiler)
