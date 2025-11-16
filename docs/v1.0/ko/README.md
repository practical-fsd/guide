# Practical FSD v1.0 문서

Next.js 15 + React Compiler + FSD 6계층 아키텍처 실전 가이드

## 개요

v1.0은 **FSD 공식 6계층 구조**를 Next.js 15 App Router와 통합한 버전입니다. 프로덕션 환경에서 검증된 패턴을 담았습니다.

### 핵심 차별점

1. **pages → views 변경**: Next.js `app/`과 충돌 해결
2. **React Compiler 통합**: 각 계층별 최적화 패턴
3. **실전 검증**: 8개 마이크로서비스 규모의 엔터프라이즈 프로젝트

## 문서 목록

### 필수 문서 (반드시 읽기)

1. **[Pages → Views 변경](./pages-to-views.md)** ⭐⭐⭐
   - FSD `pages/`를 `views/`로 변경한 이유
   - Next.js App Router와의 통합
   - 코드 예제

2. **[App Router 통합](./app-router-integration.md)** ⭐⭐⭐
   - Next.js 15 App Router 기능과 FSD 매핑
   - Server/Client Components 활용
   - Layout, Metadata, Route Handlers

3. **[6계층 구조](./six-layers.md)** ⭐⭐
   - 각 계층의 역할과 책임
   - Import 규칙
   - Slices와 Segments

4. **[React Compiler 설정](./react-compiler-setup.md)** ⭐⭐
   - React Compiler 1.0 설정
   - FSD 계층별 최적화
   - 성능 개선 사례

## 빠른 시작

```bash
# 예제 프로젝트 실행
cd examples/v1.0-basic
pnpm install
pnpm dev
```

## 학습 순서

### 초급: FSD 기본 개념

1. [6계층 구조](./six-layers.md) - FSD 전체 구조 이해
2. [Pages → Views](./pages-to-views.md) - 우리의 변경사항
3. [기본 예제](../../examples/v1.0-basic/) - 코드로 확인

### 중급: Next.js 통합

1. [App Router 통합](./app-router-integration.md) - Next.js 15 기능 활용
2. React Compiler 설정 - 성능 최적화
3. 실전 예제 분석

### 고급: 프로덕션 적용

1. Case Study (작성 예정) - 실제 프로젝트 사례
2. Best Practices (작성 예정) - 검증된 패턴
3. Migration Guide (작성 예정) - 기존 프로젝트 전환

## 기술 스택

```json
{
  "framework": "Next.js 15.5.4",
  "routing": "App Router",
  "compiler": "React Compiler 1.0",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 4",
  "architecture": "FSD 6-layer (pages → views)"
}
```

## 프로젝트 구조

```
v1.0-basic/
└── src/
    ├── app/                # Next.js App Router (라우팅 전용)
    │   ├── layout.tsx
    │   ├── page.tsx        → views/home
    │   └── dashboard/
    │       └── page.tsx    → views/dashboard
    │
    ├── views/              # 페이지 컴포지션 (FSD의 pages)
    │   ├── home/
    │   └── dashboard/
    │
    ├── widgets/            # 독립적 UI 블록
    │   ├── header/
    │   └── footer/
    │
    ├── features/           # 사용자 시나리오
    │   ├── course-enrollment/
    │   └── course-list/
    │
    ├── entities/           # 비즈니스 엔티티
    │   └── course/
    │       ├── api/
    │       ├── model/
    │       └── ui/
    │
    └── shared/             # 공통 유틸리티
        ├── components/
        ├── lib/
        └── hooks/
```

## 핵심 원칙

### 1. 명확한 역할 분리

```typescript
// app/page.tsx - 라우팅만
import { HomePage } from '@/views/home';
export default HomePage;

// src/views/home/ui/HomePage.tsx - 실제 페이지
export function HomePage() {
  return (
    <>
      <Header />
      <CourseList />
      <Footer />
    </>
  );
}
```

### 2. 단방향 의존성

```
views/    → widgets/ + features/
widgets/  → features/ + entities/
features/ → entities/ + shared/
entities/ → shared/
shared/   → (외부 라이브러리)
```

### 3. Public API 강제

```typescript
// features/course-enrollment/index.ts
export { EnrollmentButton } from './ui/EnrollmentButton';
// 내부 구현은 export하지 않음
```

## 자주 묻는 질문

### Q: 왜 `pages/`가 아니라 `views/`인가요?

Next.js의 `app/` 폴더와 개념적 충돌을 피하기 위해서입니다. [자세히 →](./pages-to-views.md)

### Q: 왜 Next.js 16이 아니라 15.5.4인가요?

**Next.js 16은 너무 최신:**
- 출시된 지 얼마 되지 않아 프로덕션 검증 부족
- 많은 라이브러리가 아직 지원하지 않음
- 생태계 호환성 리스크 존재

**안정적인 경로 선택:**
- Next.js 15.5.4 (프로덕션 검증됨)
- React 19.1.0 (호환 가능, 19.2는 Next.js 16+ 필요)
- devDependencies에 `babel-plugin-react-compiler` (Compiler 지원 필수)

[상세 설명 →](./react-compiler-setup.md#버전-선택-이유)

### Q: FSD 공식 문서와 다른데 괜찮나요?

네, v1.0은 Next.js에 최적화된 변형입니다. FSD 공식 팀도 프레임워크별 변형을 권장합니다.

### Q: React Compiler는 필수인가요?

아니요, 선택사항입니다. 하지만 성능 개선을 위해 강력히 권장합니다.

### Q: v1.0과 차이는?

v1.0은 4계층 구조로 더 간결합니다. v1.0은 엔터프라이즈 규모에 적합합니다.

## 다음 단계

- [기본 예제 실행](../../examples/v1.0-basic/)
- [Pages → Views 읽기](./pages-to-views.md)
- [프로젝트에 적용하기](#)

## 피드백

문서 개선 제안이나 질문은 [Issues](https://github.com/practical-fsd/guide/issues)에 남겨주세요!
