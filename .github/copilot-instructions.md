# agentdevplatform Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-01-06

## Active Technologies
- TypeScript/JavaScript, Next.js 14+ with static expor + Next.js, shadcn/ui, Tailwind CSS, React, context7 for MCP documentation (001-i-m-building)
- TypeScript 5.7 (strict mode), React 18.3.0 + Next.js 15.5.4, session storage (built-in) (003-once-a-learning)
- SessionStorage (already implemented via StorageService) (003-once-a-learning)
- TypeScript 5.7 (strict mode), React 18.3.0, Next.js 15.5.4 + react-markdown, remark-gfm, Tailwind CSS, shadcn/ui, mermaid (004-fix-code-snippet)
- SessionStorage (browser) via StorageService abstraction (004-fix-code-snippet)
- **GitHub Actions CI/CD, GitHub Pages static hosting, Next.js static export mode (005-i-want-to)**

## Project Structure
```
.github/
  workflows/
    deploy.yml          # [005] GitHub Actions deployment workflow
scripts/
  prepare-static.js     # [005] Post-build static export processing
src/
  app/                  # Next.js App Router
  components/           # React components
  lib/                  # Utility functions
  services/             # Business logic services
out/                    # [005] Static export output (gitignored)
next.config.js          # [005] Static export configuration
package.json            # [005] Build scripts (build:static)
```

## Commands
- `npm run dev` - Local development server (port 3000)
- `npm run build` - Production build (SSR mode)
- **`npm run build:static` - Static export for GitHub Pages (005-i-want-to)**
- `npm test` - Run Jest test suite
- `npm run lint` - ESLint code quality checks

## Code Style
TypeScript/JavaScript, Next.js 14+ with static export: Follow standard conventions

## Deployment (Feature 005)
**Platform**: GitHub Pages (static hosting)  
**Trigger**: Automatic on push to `main` branch  
**Build time**: ~4-5 minutes (cached), ~7-8 minutes (cold)  
**URL**: `https://YOUR_USERNAME.github.io/mcp-learning-platform/`

### Deployment Constraints
- ❌ **No Server-Side Rendering (SSR)**: Use `output: 'export'` mode only
- ❌ **No Image Optimization**: Use `images.unoptimized: true`
- ❌ **No API Routes**: Static files only (client-side data fetching)
- ✅ **Client-Side Routing**: Use `404.html` fallback for direct navigation
- ✅ **Base Path**: Production uses `/mcp-learning-platform` prefix

### Critical Files for Deployment
1. **next.config.js**: Must have `output: 'export'`, `basePath`, `trailingSlash: true`
2. **.github/workflows/deploy.yml**: GitHub Actions workflow (2-job pattern)
3. **scripts/prepare-static.js**: Copies `out/404/index.html` → `out/404.html`
4. **package.json**: `build:static` script must run prepare-static.js after build

### Breaking Changes to Avoid
- ⚠️ Do NOT use `next/image` with external URLs without `unoptimized: true`
- ⚠️ Do NOT create API routes (`app/api/*`) - they won't work on GitHub Pages
- ⚠️ Do NOT use Server Components with data fetching (use client components + useEffect)
- ⚠️ Do NOT remove `basePath` from next.config.js (routing will break)
- ⚠️ Do NOT change `trailingSlash: true` (GitHub Pages requires it for directories)

### Testing Deployment Changes
```bash
# Test static export locally BEFORE pushing
npm run build:static
npx serve out -p 8080
# Visit: http://localhost:8080/mcp-learning-platform/
# Test: Direct navigation to /progress, /knowledge-map
```

## Recent Changes
- **005-i-want-to**: Added GitHub Actions CI/CD, GitHub Pages deployment, Next.js static export mode
- 004-fix-code-snippet: Added TypeScript 5.7 (strict mode), React 18.3.0, Next.js 15.5.4 + react-markdown, remark-gfm, Tailwind CSS, shadcn/ui, mermaid
- 003-once-a-learning: Added TypeScript 5.7 (strict mode), React 18.3.0 + Next.js 15.5.4, session storage (built-in)
- 001-i-m-building: Added TypeScript/JavaScript, Next.js 14+ with static expor + Next.js, shadcn/ui, Tailwind CSS, React, context7 for MCP documentation

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
