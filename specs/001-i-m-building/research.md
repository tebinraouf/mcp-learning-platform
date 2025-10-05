# Research: Modern Educational MCP Learning App

**Date**: 2025-10-04  
**Feature**: Educational MCP learning platform with staged progression

## Technical Decisions & Research

### Next.js Static Export Configuration

**Decision**: Use Next.js 14+ with static export (`output: 'export'`)  
**Rationale**:

- Enables static site generation for CDN deployment
- Supports client-side routing for single-page app experience
- Compatible with embedded content strategy (no dynamic server rendering needed)
- Meets performance requirements with code splitting and optimization
- shadcn/ui components work seamlessly with Next.js

**Alternatives considered**:

- **Astro**: Excellent performance but less mature ecosystem for complex interactive features
- **Vite + React**: Would require more manual setup for static generation and routing
- **Gatsby**: Heavier bundle size, GraphQL complexity not needed for embedded content

### shadcn/ui Component Library

**Decision**: Use shadcn/ui for UI components  
**Rationale**:

- Copy-paste components align with static site approach (no external dependencies)
- Built on Radix UI primitives (excellent accessibility baseline)
- Tailwind CSS integration matches responsive, utility-first requirement
- Customizable design tokens for modern, minimal aesthetic
- Smaller bundle impact than full component libraries

**Alternatives considered**:

- **Headless UI**: Good accessibility but requires more custom styling work
- **Chakra UI**: Heavier bundle, runtime theme system not needed
- **Material-UI**: Too opinionated for unique educational design

### Embedded Content Strategy

**Decision**: Static JSON/TypeScript modules for educational content  
**Rationale**:

- Enables offline-first capability (no external API calls)
- Content versioning through build process (meets continuous update requirement)
- TypeScript interfaces provide content structure validation
- Tree-shaking optimizes bundle size
- Supports concept relationship mapping for knowledge graph

**Implementation approach**:

```typescript
// content/stages/foundations.ts
export const foundationsStage: Stage = {
  id: 'foundations',
  name: 'Foundations',
  modules: [...],
  quiz: {...},
  estimatedMinutes: 20
}
```

**Alternatives considered**:

- **MDX files**: More complex build setup, unnecessary for structured quiz data
- **External CMS**: Violates offline requirement, adds complexity
- **JSON files**: Less type safety than TypeScript modules

### Context7 Integration for MCP Documentation

**Decision**: Use context7 MCP server for latest MCP specification details  
**Rationale**:

- Provides authoritative, up-to-date MCP protocol information
- Can be called at build time to refresh embedded content
- Ensures educational content accuracy with official specs
- Supports the "continuous micro-updates" content strategy

**Integration approach**: Build-time content generation script calls context7 to populate concept definitions and examples.

### State Management & Progress Tracking

**Decision**: sessionStorage + React Context for progress state  
**Rationale**:

- Meets "session-only" persistence requirement from spec
- No external state management library needed (reduces JS bundle)
- React Context sufficient for component state sharing
- sessionStorage survives page refreshes within session

**Schema design**:

```typescript
interface ProgressState {
  stageStatuses: Record<string, 'locked' | 'in-progress' | 'completed'>;
  quizScores: Record<string, number>;
  moduleCompletions: Record<string, boolean>;
  sessionCounters: SessionCounters;
}
```

### Performance Optimization Strategy

**Decision**: Code splitting + lazy loading for non-critical features  
**Rationale**:

- Meets <2.0s first interactive requirement
- Knowledge map visualization can be lazy-loaded post-interaction
- Quiz components loaded per-stage (not upfront)
- Image optimization for concept diagrams

**Bundle strategy**:

- Critical CSS inline for above-fold content
- Non-critical visualizations in separate chunks
- Progressive enhancement for advanced features

### Accessibility Implementation

**Decision**: WCAG AA compliance through semantic HTML + aria-labels  
**Rationale**:

- shadcn/ui components include accessibility features
- Focus management for modal/dialog interactions
- Screen reader optimization for progress indicators
- Keyboard navigation for all interactive elements

**Testing approach**: Automated axe testing + manual keyboard navigation validation

### Update Notification Mechanism

**Decision**: Build-time content hash + client-side comparison  
**Rationale**:

- Enables "Updated" badge feature without polling
- Static file approach (no server-side logic needed)
- One-time notification per build matches spec requirement

**Implementation**: Generate content version hash at build, compare with sessionStorage on load.

## Architecture Patterns

### Component Structure

```
components/
├── ui/           # shadcn/ui components
├── features/     # Feature-specific components
│   ├── stages/
│   ├── quizzes/
│   └── knowledge-map/
├── layout/       # Page layout components
└── shared/       # Reusable business components
```

### Content Structure

```
content/
├── stages/       # Learning stage definitions
├── concepts/     # MCP concept definitions
├── quizzes/      # Quiz questions and answers
└── metadata/     # App configuration and constants
```

## Risk Assessment

**Performance Risk**: Knowledge map visualization complexity  
**Mitigation**: Lazy load, use lightweight graph library (react-flow-lite or custom SVG)

**Content Accuracy Risk**: MCP specification changes  
**Mitigation**: Automated content refresh via context7 in CI/CD pipeline

**Accessibility Risk**: Complex interactive visualizations  
**Mitigation**: Provide alternative text-based navigation, keyboard shortcuts

## Dependencies & Versions

**Core Dependencies**:

- Next.js 14+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- shadcn/ui (latest)

**Development Dependencies**:

- Jest + React Testing Library
- Playwright (E2E testing)
- ESLint + Prettier
- axe-core (accessibility testing)

## Build & Deployment Strategy

**Static Export**: `next build && next export`  
**CDN Deployment**: Compatible with Vercel, Netlify, Azure Static Web Apps  
**Performance Monitoring**: Lighthouse CI in build pipeline  
**Content Updates**: Webhook-triggered rebuilds for content changes
