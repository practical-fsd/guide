# Practical FSD v1.0 Documentation

Next.js 15 + React Compiler + FSD 6-Layer Architecture Guide

> [한국어 문서](../ko/README.md) | **English**

## Overview

v1.0 integrates the **official FSD 6-layer architecture** with Next.js 15 App Router. These patterns have been tested in production environments.

### Key Differentiators

1. **pages → views renaming**: Resolves conflicts with Next.js `app/`
2. **React Compiler integration**: Optimization patterns per FSD layer
3. **Production-proven**: Enterprise-scale project with 8 microservices

## Documentation

### Essential Reading (Must Read)

1. **[Pages → Views Renaming](./pages-to-views.md)** ⭐⭐⭐
   - Why we renamed FSD's `pages/` to `views/`
   - Integration with Next.js App Router
   - Code examples

2. **[App Router Integration](./app-router-integration.md)** ⭐⭐⭐
   - Mapping Next.js 15 features to FSD layers
   - Server/Client Components usage
   - Layouts, Metadata, Route Handlers

3. **[6-Layer Architecture](./six-layers.md)** ⭐⭐
   - Role and responsibility of each layer
   - Import rules
   - Slices and Segments

4. **[React Compiler Setup](./react-compiler-setup.md)** ⭐⭐
   - React Compiler 1.0 configuration
   - Layer-specific optimizations
   - Performance improvements

## Quick Start

```bash
# Run example project
cd examples/v1.0-basic
pnpm install
pnpm dev
```

## Learning Path

### Beginner: FSD Basics

1. [6-Layer Architecture](./six-layers.md) - Understanding FSD structure
2. [Pages → Views](./pages-to-views.md) - Our modifications
3. [Basic Example](../../examples/v1.0-basic/) - See it in code

### Intermediate: Next.js Integration

1. [App Router Integration](./app-router-integration.md) - Leveraging Next.js 15
2. [React Compiler Setup](./react-compiler-setup.md) - Performance optimization
3. Analyzing real examples

### Advanced: Production

1. Case Study (coming soon) - Real project insights
2. Best Practices (coming soon) - Proven patterns
3. Migration Guide (coming soon) - Converting existing projects

## Tech Stack

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

## Project Structure

```
v1.0-basic/
└── src/
    ├── app/                # Next.js App Router (routing only)
    │   ├── layout.tsx
    │   ├── page.tsx        → views/home
    │   └── dashboard/
    │       └── page.tsx    → views/dashboard
    │
    ├── views/              # Page composition (FSD's pages)
    │   ├── home/
    │   └── dashboard/
    │
    ├── widgets/            # Independent UI blocks
    │   ├── header/
    │   └── footer/
    │
    ├── features/           # User scenarios
    │   ├── course-enrollment/
    │   └── course-list/
    │
    ├── entities/           # Business entities
    │   └── course/
    │       ├── api/
    │       ├── model/
    │       └── ui/
    │
    └── shared/             # Common utilities
        ├── components/
        ├── lib/
        └── hooks/
```

## Core Principles

### 1. Clear Separation of Concerns

```typescript
// app/page.tsx - routing only
import { HomePage } from '@/views/home';
export default HomePage;

// src/views/home/ui/HomePage.tsx - actual page
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

### 2. Unidirectional Dependencies

```
views/    → widgets/ + features/
widgets/  → features/ + entities/
features/ → entities/ + shared/
entities/ → shared/
shared/   → (external libraries only)
```

### 3. Enforced Public API

```typescript
// features/course-enrollment/index.ts
export { EnrollmentButton } from './ui/EnrollmentButton';
// Internal implementation is not exported
```

## FAQ

### Q: Why `views/` instead of `pages/`?

To avoid conceptual conflicts with Next.js's `app/` folder. [Learn more →](./pages-to-views.md)

### Q: Is this different from official FSD?

Yes, v1.0 is optimized for Next.js. The official FSD team encourages framework-specific adaptations.

### Q: Is React Compiler required?

No, it's optional. However, we strongly recommend it for performance improvements.

### Q: What's the difference from v2.0?

v2.0 will feature a simplified 4-layer structure. v1.0 is suited for enterprise-scale projects.

## Next Steps

- [Run basic example](../../examples/v1.0-basic/)
- [Read Pages → Views](./pages-to-views.md)
- [Apply to your project](#)

## Feedback

Feel free to open issues for documentation improvements or questions at [Issues](https://github.com/practical-fsd/guide/issues)!
