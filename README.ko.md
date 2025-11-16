# Practical FSD

> [English](./README.md) | **한국어**

**Next.js 15 + React Compiler + Feature-Sliced Design 실전 가이드**

Next.js 15와 Feature-Sliced Design을 통합한 실전 가이드입니다.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## 특징

- ✅ **Next.js 15.5.4** + App Router
- ✅ **React 19** + React Compiler 1.0
- ✅ **FSD 6계층** 아키텍처 (`pages` → `views` 변경)
- ✅ **TypeScript** 완전 지원
- ✅ **실전 검증**: 프로덕션 환경에서 검증됨
- ✅ **한국어/영어** 문서

## 빠른 시작

```bash
# 저장소 클론
git clone https://github.com/practical-fsd/guide.git
cd guide

# 모든 의존성 설치 (workspace)
pnpm install

# v1.0 예제 실행
pnpm dev

# 또는 특정 버전 실행
pnpm dev:v1
```

http://localhost:3000 접속

### 사용 가능한 명령어

```bash
pnpm dev          # v1.0-basic 예제 실행
pnpm build        # 모든 예제 빌드
pnpm lint         # 모든 예제 린트
pnpm clean        # 모든 node_modules와 .next 정리
```

## 왜 이 가이드인가?

### 문제

- Next.js App Router와 FSD `pages/` 계층 충돌
- React Compiler를 FSD와 어떻게 통합할지 불명확
- 엔터프라이즈 규모 프로젝트에 FSD를 적용한 사례 부족

### 해결

- ✅ **pages → views 변경**: Next.js와 FSD의 명확한 역할 분리
- ✅ **React Compiler 통합**: FSD 각 계층별 최적화 패턴
- ✅ **실전 경험**: LABS 프로젝트 (Hunet) 프로덕션 환경에서 검증됨

## 문서 구조

### 📚 v1.0 핵심 문서

| 문서 | 설명 | 우선순위 |
|-----|------|---------|
| [Pages → Views](./docs/v1.0/ko/pages-to-views.md) | FSD `pages/`를 `views/`로 변경한 이유와 방법 | ⭐⭐⭐ |
| [App Router 통합](./docs/v1.0/ko/app-router-integration.md) | Next.js 15 App Router와 FSD 통합 가이드 | ⭐⭐⭐ |
| [6계층 구조](./docs/v1.0/ko/six-layers.md) | FSD 6계층 완벽 가이드 | ⭐⭐ |
| [React Compiler](./docs/v1.0/ko/react-compiler-setup.md) | React Compiler 설정 및 FSD 활용 | ⭐⭐ |

### 💻 예제 코드

| 예제 | 설명 |
|-----|------|
| [v1.0-basic](./examples/v1.0-basic/) | 기본 구조: Home, Dashboard 페이지 |

## 프로젝트 구조

```
practical-fsd/
├── docs/
│   └── v1.0/                    # v1.0 문서
│       ├── pages-to-views.md    # 핵심 차별점
│       ├── app-router-integration.md
│       ├── six-layers.md
│       └── react-compiler-setup.md
│
├── examples/
│   └── v1.0-basic/              # 기본 예제
│       └── src/
│           ├── app/             # Next.js App Router (라우팅)
│           ├── views/           # 페이지 컴포지션 (FSD pages)
│           ├── widgets/         # 독립 UI 블록
│           ├── features/        # 사용자 시나리오
│           ├── entities/        # 비즈니스 엔티티
│           └── shared/          # 공통 유틸리티
│
└── README.md                    # 이 파일
```

## 핵심 개념

### 1. pages → views 변경

Next.js의 `app/` 폴더와 충돌을 피하기 위해 FSD의 `pages/` 계층을 `views/`로 변경했습니다.

```
app/page.tsx        → views/home/ui/HomePage.tsx
(라우팅만)             (실제 페이지 로직)
```

[자세히 보기 →](./docs/v1.0/ko/pages-to-views.md)

### 2. FSD 6계층 구조

```
app/        ← Next.js 라우팅 (FSD 외부)
views/      ← 페이지 컴포지션
widgets/    ← 독립 UI 블록
features/   ← 사용자 시나리오
entities/   ← 비즈니스 엔티티
shared/     ← 공통 유틸리티
```

[자세히 보기 →](./docs/v1.0/ko/six-layers.md)

### 3. React Compiler 통합

```typescript
// ✅ Compiler가 자동 최적화
function CourseList({ courses }) {
  const filtered = courses.filter(c => c.isActive);
  return filtered.map(course => <CourseCard course={course} />);
}
```

[자세히 보기 →](./docs/v1.0/ko/react-compiler-setup.md)

## 학습 경로

1. **[Pages → Views 변경](./docs/v1.0/ko/pages-to-views.md)** - 가장 중요한 개념
2. **[기본 예제 실행](./examples/v1.0-basic/)** - 실제 코드 확인
3. **[App Router 통합](./docs/v1.0/ko/app-router-integration.md)** - Next.js 통합 방법
4. **[6계층 구조](./docs/v1.0/ko/six-layers.md)** - 전체 아키텍처 이해
5. **[React Compiler](./docs/v1.0/ko/react-compiler-setup.md)** - 성능 최적화

## 실전 사례

### LABS 프로젝트 (Hunet)

- **규모**: 5개 서비스
- **팀**: 프론트엔드 개발자 8명
- **결과**:
  - 코드 일관성 향상
  - 신입 개발자 온보딩 시간 단축
  - 번들 크기 감소

## 기여하기

이슈와 PR을 환영합니다!

## 로드맵

### v1.0 (현재) - Release 1.0.0
- ✅ 핵심 문서 4개
- ✅ 기본 예제 코드
- ✅ 6계층 구조 (pages → views)
- ✅ React Compiler 통합
- ✅ Next.js 15.5.4 + React 19 지원

### v2.0 (계획)
- [ ] 5계층 구조 옵션 (간소화)
- [ ] 더 많은 예제 (i18n, 테스팅 등)
- [ ] 마이그레이션 가이드

## 라이선스

MIT License - [LICENSE](./LICENSE) 파일 참조

## 크레딧

- **개발**: Hunet Frontend 개발팀
- **문서화**: Practical FSD 프로젝트

## 관련 링크

- [Next.js 15 문서](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [FSD 공식 문서](https://feature-sliced.design/)

---

**Made with ❤️ by Korean developers for the world**

궁금한 점이 있으시면 [Issues](https://github.com/practical-fsd/guide/issues)에 남겨주세요!
