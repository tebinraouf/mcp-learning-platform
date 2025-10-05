# MCP Learning Platform

An interactive educational platform for learning the Model Context Protocol (MCP) with staged progression, quizzes, and comprehensive concept coverage.

## 🎯 Features

- **5 Progressive Learning Stages**: From foundations to mastery
- **20 Interactive Modules**: Comprehensive MCP concept coverage
- **40 Quiz Questions**: Test your understanding
- **Progress Tracking**: Analytics and session metrics
- **Knowledge Map**: Visual concept relationships
- **Accessibility**: WCAG AA compliant
- **Session-Based**: All progress stored in browser session

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.0.0 with static export
- **Language**: TypeScript 5.7.3 (strict mode)
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Storage**: Browser sessionStorage
- **Testing**: Jest, React Testing Library, Playwright

### Project Structure

```
agentdevplatform/
├── src/
│   ├── app/                    # Next.js 15 App Router pages
│   │   ├── page.tsx           # Home/dashboard
│   │   ├── stage/[id]/        # Stage detail pages
│   │   ├── module/[id]/       # Module content pages
│   │   ├── quiz/[stageId]/    # Quiz pages
│   │   ├── progress/          # Progress dashboard
│   │   ├── knowledge-map/     # Concept visualization
│   │   ├── about/             # Platform information
│   │   ├── not-found.tsx      # 404 page
│   │   └── layout.tsx         # Root layout with error boundary
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── QuizQuestion.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StageCard.tsx
│   │   ├── ModuleCard.tsx
│   │   ├── KnowledgeMap.tsx
│   │   ├── FeedbackDialog.tsx
│   │   ├── NavigationHeader.tsx
│   │   └── ErrorBoundary.tsx
│   ├── services/              # Business logic layer
│   │   ├── LearnerService.ts  # Learner profile management
│   │   ├── QuizService.ts     # Quiz logic and scoring
│   │   ├── ContentService.ts  # Content retrieval
│   │   ├── AnalyticsService.ts# Progress analytics
│   │   ├── FeedbackService.ts # User feedback
│   │   └── StorageService.ts  # SessionStorage abstraction
│   ├── content/               # MCP educational content
│   │   ├── stages.ts         # 5 learning stages
│   │   ├── modules.ts        # 20 modules (4 per stage)
│   │   └── quizzes.ts        # 40 questions (8 per stage)
│   ├── lib/                   # Utilities
│   │   ├── utils.ts          # General utilities
│   │   └── accessibility.ts  # WCAG compliance helpers
│   └── types/                 # TypeScript type definitions
│       └── index.ts          # Core types from data-model.md
├── public/                    # Static assets
├── ACCESSIBILITY.md           # WCAG AA compliance checklist
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd agentdevplatform

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm start` - Serve production build
- `npm run lint` - Run ESLint
- `npm test` - Run Jest unit tests
- `npm run test:e2e` - Run Playwright E2E tests

## 📚 Learning Journey

### Stage 1: MCP Foundations

- Core protocol concepts
- JSON-RPC basics
- Client-server architecture
- **4 modules, 8 quiz questions**

### Stage 2: Architecture & Messages

- Message structure
- Resource management
- Tool implementation
- **4 modules, 8 quiz questions**

### Stage 3: Advanced Patterns

- Sampling strategies
- Error handling
- Progressive disclosure
- **4 modules, 8 quiz questions**

### Stage 4: Building & Debugging

- Server implementation
- Testing strategies
- Debugging techniques
- **4 modules, 8 quiz questions**

### Stage 5: Mastery

- Performance optimization
- Security best practices
- Production deployment
- **4 modules, 8 quiz questions**

## 🎓 User Flow

1. **Start Session**: Platform initializes learner profile
2. **Browse Stages**: View available learning stages
3. **Complete Modules**: Read content, track progress
4. **Take Quizzes**: Test understanding (70% passing score)
5. **Track Progress**: View analytics and achievements
6. **Explore Concepts**: Visualize knowledge map

## 🔧 Services Architecture

### LearnerService

- Initialize and manage learner profiles
- Track module completions
- Manage stage progression
- Calculate session duration

### QuizService

- Retrieve quizzes by stage
- Grade quiz attempts (70% threshold)
- Identify weak concepts
- Track quiz statistics

### ContentService

- Provide stage and module content
- Search functionality
- Concept management
- Progress calculations

### AnalyticsService

- Session analytics
- Quiz performance metrics
- Engagement tracking
- Progress milestones

### StorageService

- SessionStorage abstraction
- JSON serialization/deserialization
- Error handling
- Storage size monitoring

## ♿ Accessibility

This platform is built to meet **WCAG AA** standards:

- ✅ Keyboard navigation throughout
- ✅ Screen reader support with ARIA labels
- ✅ Focus indicators on all interactive elements
- ✅ Color contrast ratios meet 4.5:1 minimum
- ✅ Semantic HTML structure
- ✅ Error boundary for graceful error handling
- ✅ Skip links for main content
- ✅ Responsive design (mobile-first)

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for complete checklist.

## 🧪 Testing

### Unit Tests

Tests for all services and utilities (Jest):

```bash
npm test
```

### Component Tests

React component tests with Testing Library:

```bash
npm test -- --testPathPattern=components
```

### E2E Tests

Full user journey tests with Playwright:

```bash
npm run test:e2e
```

## 📦 Build & Deployment

### Static Export

This app is configured for static export:

```bash
npm run build
```

Output in `out/` directory. Can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Environment

No environment variables required - all content is bundled.

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components with Radix UI primitives
- **CSS Custom Properties** for theming
- **Dark mode** support built-in

## 📊 Data Model

All types defined in `src/types/index.ts`:

- `Learner` - User profile and session data
- `Stage` - Learning stage definition
- `Module` - Content module
- `Quiz` - Quiz with questions
- `Question` - Quiz question with options
- `QuizAttempt` - Quiz attempt record
- `ProgressRecord` - Overall progress tracking
- `FeedbackEntry` - User feedback

## 🔐 Privacy

- **No backend**: All data stored in browser session
- **No analytics tracking**: Privacy-first design
- **Session-only**: Data cleared on browser close
- **No cookies**: Uses sessionStorage only

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- TypeScript strict mode
- ESLint configuration enforced
- Prettier for formatting
- Conventional commit messages

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Model Context Protocol** specification and documentation
- **shadcn/ui** for beautiful component primitives
- **Vercel** for Next.js framework
- **Radix UI** for accessible component foundations

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check [ACCESSIBILITY.md](./ACCESSIBILITY.md) for accessibility concerns
- Review [data-model.md](./docs/data-model.md) for data structure

---

Built with ❤️ for the MCP community
