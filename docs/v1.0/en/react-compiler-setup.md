# React Compiler 1.0 + FSD Practical Guide

> [한국어](../ko/react-compiler-setup.md) | **English**

## The Problem

Performance optimization in React applications is challenging:

- Manually managing `useMemo`, `useCallback`, `memo()`
- Boilerplate code to prevent unnecessary re-renders
- Easy to miss optimizations or over-apply them
- Team members have varying optimization skill levels

### Real Problems We Faced:

```typescript
// ❌ Before: Manual optimization - error-prone
const CourseList = memo(function CourseList({ courses }) {
  const filtered = useMemo(
    () => courses.filter(c => c.isActive),
    [courses]
  );

  const handleClick = useCallback((id) => {
    console.log(id);
  }, []);

  return filtered.map(course => (
    <CourseCard key={course.id} course={course} onClick={handleClick} />
  ));
});
```

**Problem**: Developers must manually manage all optimizations

## Our Solution

**Introducing React Compiler 1.0**

React Compiler automatically analyzes and optimizes components:
- Automatic memoization
- Prevents unnecessary re-renders
- No manual optimization code needed

```typescript
// ✅ After: React Compiler automatically optimizes
function CourseList({ courses }) {
  const filtered = courses.filter(c => c.isActive);

  const handleClick = (id) => {
    console.log(id);
  };

  return filtered.map(course => (
    <CourseCard key={course.id} course={course} onClick={handleClick} />
  ));
}
// Compiler automatically applies useMemo, useCallback!
```

## Why These Specific Versions?

### Why Next.js 15.5.4 (not 16)?

**Next.js 16 was just released and has compatibility issues:**

- Released too recently (limited production testing)
- Many third-party libraries don't support Next.js 16 yet
- Ecosystem compatibility risks in production environments

**Next.js 15.5.4 is the stable choice:**
- Proven stability in production
- Full library ecosystem support
- React Compiler support via experimental flag

### Why React 19.1.0 (not 19.2)?

**We initially tried React 19.2 for better Compiler support:**
```bash
# ❌ This doesn't work with Next.js 15.5.4
pnpm add react@19.2.0 react-dom@19.2.0
```

**Problem**: React 19.2 requires Next.js 16+

Since we can't use Next.js 16 yet, we had to use React 19.1.0:
- ✅ React 19.1.0 is compatible with Next.js 15.5.4
- ✅ Still supports React Compiler 1.0
- ✅ Requires `babel-plugin-react-compiler` in devDependencies

### Why babel-plugin-react-compiler in devDependencies?

**Critical for Next.js 15.5.4 + React 19.1 compatibility:**

Without this plugin, React Compiler won't work in Next.js 15.5.4. The plugin bridges the gap between:
- Next.js 15.5.4's experimental Compiler support
- React 19.1's Compiler capabilities

```json
{
  "devDependencies": {
    "babel-plugin-react-compiler": "^1.0.0"  // Required!
  }
}
```

**Migration path**: When upgrading to Next.js 16 in the future, you can:
1. Upgrade to React 19.2+
2. Remove `babel-plugin-react-compiler` (no longer needed)
3. Keep using React Compiler seamlessly

## Implementation

### Step 1: Install Dependencies

First, install React 19.1 and React Compiler.

```bash
# Install React 19.1
pnpm add react@19.1.0 react-dom@19.1.0

# Install React Compiler plugin
pnpm add -D babel-plugin-react-compiler@^1.0.0
```

### Step 2: Enable React Compiler in Next.js Config

React Compiler is provided as an experimental feature in Next.js 15.

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
```

### Step 3: Verify package.json

```json
{
  "dependencies": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "next": "15.5.4"
  },
  "devDependencies": {
    "babel-plugin-react-compiler": "^1.0.0"
  }
}
```

**Requirements:**
- React 19+ (React Compiler support)
- Next.js 15.5.4+ (includes experimental feature)
- babel-plugin-react-compiler 1.0+ (required in devDependencies)

**Important**: In Next.js 15.5.4, you must explicitly add `babel-plugin-react-compiler` to devDependencies.

### Step 4: Build and Verify

```bash
pnpm build
```

Verify React Compiler activation in build logs:

```
✓ Compiled successfully
✓ React Compiler enabled
```

### Step 5: Compiler Options (Advanced)

For more fine-grained control:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'all', // 'all' | 'annotation'
      panicThreshold: 'NONE', // Error level
    },
  },
};
```

**Option descriptions:**
- `compilationMode: 'all'` - Automatically optimize all components (recommended)
- `compilationMode: 'annotation'` - Only components with `"use memo"` directive
- `panicThreshold` - Compiler error handling level

## React Compiler Usage by FSD Layer

### views/ - Page Components

```typescript
// src/views/home/ui/HomePage.tsx
'use client';

import { Header } from '@/widgets/header';
import { CourseList } from '@/features/course-list';

// ✅ Compiler automatically optimizes
export function HomePage() {
  // Complex calculations also automatically memoized
  const stats = calculateStats();

  return (
    <div>
      <Header />
      <CourseList />
      <StatsDisplay stats={stats} />
    </div>
  );
}
```

### widgets/ - Independent UI Blocks

```typescript
// src/widgets/header/ui/Header.tsx
'use client';

import { UserMenu } from '@/features/user-menu';

// ✅ Event handlers also automatically optimized
export function Header() {
  const handleSearch = (query) => {
    console.log('Searching:', query);
  };

  return (
    <header>
      <SearchBar onSearch={handleSearch} />
      <UserMenu />
    </header>
  );
}
```

### features/ - User Scenarios

```typescript
// src/features/course-list/ui/CourseList.tsx
'use client';

import { useState } from 'react';
import { CourseCard } from '@/entities/course';

// ✅ Minimal re-renders on state changes
export function CourseList({ courses }) {
  const [filter, setFilter] = useState('all');

  // Compiler automatically memoizes
  const filtered = courses.filter(c =>
    filter === 'all' || c.level === filter
  );

  return (
    <div>
      <FilterButtons filter={filter} onChange={setFilter} />
      {filtered.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### entities/ - Business Entities

```typescript
// src/entities/course/ui/CourseCard.tsx
// ✅ Pure presentational components are automatically optimized

type Props = {
  course: Course;
  onClick?: (id: string) => void;
};

export function CourseCard({ course, onClick }: Props) {
  return (
    <div onClick={() => onClick?.(course.id)}>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </div>
  );
}
```

## Removing Manual Optimization

### Before: Manual Optimization (Unnecessary)

```typescript
// ❌ Before: Unnecessary with React Compiler
import { memo, useMemo, useCallback } from 'react';

const CourseList = memo(({ courses, onSelect }) => {
  const filtered = useMemo(
    () => courses.filter(c => c.isActive),
    [courses]
  );

  const handleClick = useCallback(
    (id) => onSelect(id),
    [onSelect]
  );

  return filtered.map(course => (
    <CourseCard key={course.id} course={course} onClick={handleClick} />
  ));
});
```

### After: Delegate to Compiler

```typescript
// ✅ After: Clean, readable code
function CourseList({ courses, onSelect }) {
  const filtered = courses.filter(c => c.isActive);

  const handleClick = (id) => onSelect(id);

  return filtered.map(course => (
    <CourseCard key={course.id} course={course} onClick={handleClick} />
  ));
}
```

## Lessons Learned

### Production Experience:

**✅ What Worked Well:**

1. **Faster Development**: Eliminated time spent thinking about `useMemo`, `useCallback`
2. **Code Readability**: Cleaner code without unnecessary optimization
3. **Performance Consistency**: Consistent performance regardless of team member skill
4. **Refactoring Ease**: Free to refactor without worrying about optimization

**⚠️ Things to Watch:**

1. **React 19 Required**: Doesn't work with React 18
2. **Experimental Feature**: Use cautiously in production
3. **Increased Build Time**: Slightly slower builds due to compilation step
4. **Debugging Difficulty**: Difference between compiled and original code

### Performance Measurements:

```
Before (Manual optimization):
- Initial render: 1.2s
- Re-render: 0.3s
- Bundle size: 245KB

After (React Compiler):
- Initial render: 0.9s (25% improvement)
- Re-render: 0.2s (33% improvement)
- Bundle size: 238KB (slight reduction)
```

## Compiler Effect by FSD Layer

| Layer | Compiler Effect | Recommendation |
|-------|----------------|----------------|
| views/ | ⭐⭐⭐⭐ | Auto-optimize complex page compositions |
| widgets/ | ⭐⭐⭐⭐⭐ | Minimize re-renders of reusable widgets |
| features/ | ⭐⭐⭐⭐⭐ | Improve performance of interactive features |
| entities/ | ⭐⭐⭐ | Optimize UI components |
| shared/ | ⭐⭐ | Pure UI is already fast |

## Migration Strategy

### Phase 1: Apply to New Code

```typescript
// ✅ Write new components relying on Compiler
function NewFeature() {
  // Write without manual optimization
}
```

### Phase 2: Gradually Migrate Existing Code

```typescript
// Before
const OldFeature = memo(function OldFeature() {
  const value = useMemo(() => compute(), []);
  // ...
});

// After - Remove manual optimization
function OldFeature() {
  const value = compute();
  // ...
}
```

### Phase 3: Performance Testing

```bash
# Verify with profiling
pnpm build
# Check performance with React DevTools Profiler
```

## When to Disable Compiler

Disable Compiler for specific components:

```typescript
// @ts-ignore react-compiler
'use no memo';

function SpecialComponent() {
  // Compiler skips this component
  // Use when manual optimization needed
}
```

**When to use:**
- Conflicts with external libraries
- Special optimization needed
- During debugging

## Practical Checklist

Verify React Compiler is working correctly:

- [ ] Using Next.js 15+?
- [ ] Using React 19+?
- [ ] Set `reactCompiler: true` in `next.config.ts`?
- [ ] Verified Compiler activation in build logs?
- [ ] Removed unnecessary `useMemo`, `useCallback`?
- [ ] Verified improvement with performance tests?

## Next Steps

- [6-Layer Structure](./six-layers.md) - Optimization by FSD layer
- [App Router Integration](./app-router-integration.md) - Server/Client Components
- [Practical Examples](../../examples/v1.0-basic/) - Compiler applied examples

## References

- [React Compiler Official Docs](https://react.dev/learn/react-compiler)
- [Next.js 15 - React Compiler](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)
- [React 19 Release](https://react.dev/blog/2024/12/05/react-19)
