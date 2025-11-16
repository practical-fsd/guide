# Practical FSD

**Next.js 15 + React Compiler + Feature-Sliced Design Guide**

A practical guide for integrating Next.js 15 with Feature-Sliced Design.

> **English** | [한국어](./README.ko.md)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## Features

- ✅ **Next.js 15.5.4** + App Router (stable choice over v16)
- ✅ **React 19.1** + React Compiler 1.0 (optimal compatibility)
- ✅ **FSD 6-layer** architecture (`pages` → `views` renamed)
- ✅ **Full TypeScript** support
- ✅ **Production-ready**: Tested in real-world applications
- ✅ **Multilingual**: English & Korean documentation

> **Why Next.js 15.5.4 instead of 16?** Next.js 16 was just released and lacks ecosystem support. We use Next.js 15.5.4 + React 19.1 + `babel-plugin-react-compiler` for production stability. [Learn more →](./docs/v1.0/en/react-compiler-setup.md#why-these-specific-versions)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/practical-fsd/guide.git
cd guide

# Install all dependencies (workspace)
pnpm install

# Run v1.0 example
pnpm dev

# Or run specific version
pnpm dev:v1
```

Visit http://localhost:3000

### Available Commands

```bash
pnpm dev          # Run v1.0-basic example
pnpm build        # Build all examples
pnpm lint         # Lint all examples
pnpm clean        # Clean all node_modules and .next
```

## Why This Guide?

### The Problem

- Next.js App Router conflicts with FSD's `pages/` layer
- Unclear how to integrate React Compiler with FSD
- Lack of enterprise-scale FSD implementation examples

### Our Solution

- ✅ **pages → views renaming**: Clear separation between Next.js and FSD
- ✅ **React Compiler integration**: Layer-specific optimization patterns
- ✅ **Real-world experience**: Tested in production environment

## Documentation

### 📚 v1.0 Core Docs

| Document | Description | Priority |
|----------|-------------|----------|
| [Pages → Views](./docs/v1.0/en/pages-to-views.md) | Why and how we renamed FSD's `pages/` to `views/` | ⭐⭐⭐ |
| [App Router Integration](./docs/v1.0/en/app-router-integration.md) | Next.js 15 App Router + FSD integration guide | ⭐⭐⭐ |
| [6-Layer Architecture](./docs/v1.0/en/six-layers.md) | Complete FSD 6-layer guide | ⭐⭐ |
| [React Compiler](./docs/v1.0/en/react-compiler-setup.md) | React Compiler setup & FSD usage | ⭐⭐ |

### 💻 Example Code

| Example | Description |
|---------|-------------|
| [v1.0-basic](./examples/v1.0-basic/) | Basic structure: Home, Dashboard pages |

## Project Structure

```
practical-fsd/
├── docs/
│   └── v1.0/
│       ├── en/                  # English docs
│       │   ├── pages-to-views.md
│       │   ├── app-router-integration.md
│       │   ├── six-layers.md
│       │   └── react-compiler-setup.md
│       └── ko/                  # Korean docs
│           └── ... (same structure)
│
├── examples/
│   └── v1.0-basic/              # Basic example
│       └── src/
│           ├── app/             # Next.js App Router (routing)
│           ├── views/           # Page composition (FSD pages)
│           ├── widgets/         # Independent UI blocks
│           ├── features/        # User scenarios
│           ├── entities/        # Business entities
│           └── shared/          # Common utilities
│
└── README.md                    # This file
```

## Core Concepts

### 1. pages → views Renaming

We renamed FSD's `pages/` layer to `views/` to avoid conflicts with Next.js's `app/` folder.

```
app/page.tsx        → views/home/ui/HomePage.tsx
(routing only)        (actual page logic)
```

[Learn more →](./docs/v1.0/en/pages-to-views.md)

### 2. FSD 6-Layer Architecture

```
app/        ← Next.js routing (outside FSD)
views/      ← Page composition
widgets/    ← Independent UI blocks
features/   ← User scenarios
entities/   ← Business entities
shared/     ← Common utilities
```

[Learn more →](./docs/v1.0/en/six-layers.md)

### 3. React Compiler Integration

```typescript
// ✅ Compiler automatically optimizes
function CourseList({ courses }) {
  const filtered = courses.filter(c => c.isActive);
  return filtered.map(course => <CourseCard course={course} />);
}
```

[Learn more →](./docs/v1.0/en/react-compiler-setup.md)

## Learning Path

1. **[Pages → Views](./docs/v1.0/en/pages-to-views.md)** - Most important concept
2. **[Run Basic Example](./examples/v1.0-basic/)** - See actual code
3. **[App Router Integration](./docs/v1.0/en/app-router-integration.md)** - Next.js integration
4. **[6-Layer Architecture](./docs/v1.0/en/six-layers.md)** - Complete architecture
5. **[React Compiler](./docs/v1.0/en/react-compiler-setup.md)** - Performance optimization

## Real-World Case Study

### LABS Project (Hunet)

- **Scale**: 5 services
- **Team**: 8 frontend developers
- **Results**:
  - Improved code consistency
  - Faster onboarding for new developers
  - Reduced bundle size

## Contributing

Issues and PRs are welcome!

### Improvement Ideas

- [ ] i18n pattern documentation
- [ ] Testing guide
- [ ] Storybook integration
- [ ] Performance measurement case studies

## Roadmap

### v1.0 (Current) - Release 1.0.0
- ✅ 4 core documents
- ✅ Basic example code
- ✅ 6-layer architecture (pages → views)
- ✅ React Compiler integration
- ✅ Next.js 15.5.4 + React 19 support

### v2.0 (Planned)
- [ ] 5-layer architecture option (simplified)
- [ ] More examples (i18n, testing, etc.)
- [ ] Migration guide
- [ ] Video tutorials

## License

MIT License - See [LICENSE](./LICENSE) file

## Credits

- **Development**: Hunet LABS 3.0 Team
- **Documentation**: Practical FSD Project
- **Inspiration**: [Feature-Sliced Design](https://feature-sliced.design/)

## Links

- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)
- [FSD Official Docs](https://feature-sliced.design/)

---

**Made with ❤️ by developers for developers**

Questions? Feel free to open an [Issue](https://github.com/practical-fsd/guide/issues)!
