# 🔗 LinkedIn Fetcher

<div align="center">

A modern LinkedIn profile scraping service built with TypeScript and Fastify.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-Latest-black.svg)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-2D3748.svg)](https://www.postgresql.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-Latest-green.svg)](https://orm.drizzle.team)
[![Code Style](https://img.shields.io/badge/Code_Style-Biome-purple.svg)](https://biomejs.dev/)
[![Coverage](https://img.shields.io/codecov/c/github/rafaumeu/linkedin-fetcher/main)](https://codecov.io/gh/rafaumeu/linkedin-fetcher)
[![Release](https://img.shields.io/github/v/release/rafaumeu/linkedin-fetcher)](https://github.com/rafaumeu/linkedin-fetcher/releases)
[![License](https://img.shields.io/github/license/rafaumeu/linkedin-fetcher)](LICENSE)

---

## 📖 Table of Contents

| [Features](#-features) | [Tech Stack](#-tech-stack) | [Development](#-development) |
|----------------------|---------------------------|--------------------------|
| [Prerequisites](#-prerequisites) | [Setup](#️-setup) | [Testing](#-testing) | [Contributing](#-contributing) |

---

</div>

## 🚀 Features

### Profile Scraping
- Extract professional experience
- Gather educational background
- Collect skills and certifications
- Profile information retrieval

### Data Management
- Efficient data storage with PostgreSQL
- Type-safe database operations with Drizzle ORM
- Data validation using Zod
- RESTful API for data access

### Security & Performance
- Rate limiting and proxy rotation
- Error handling and retry mechanisms
- Automated data validation
- Performance monitoring

## ⚡ Tech Stack

### Core
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Validation**: Zod

### Development Tools
- **Package Manager**: Yarn
- **Linting/Formatting**: Biome
- **Testing**: Vitest
- **CI/CD**: GitHub Actions

## 💻 Development

### Prerequisites
- Node.js >= 20
- Yarn
- PostgreSQL
- Git

### Setup
1. Clone the repository
```bash
git clone https://github.com/rafaumeu/linkedin-fetcher.git
cd linkedin-fetcher
```

2. Install dependencies
```bash
yarn install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start development server
```bash
yarn dev
```

### Available Scripts
- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn start`: Run production build
- `yarn test`: Run tests
- `yarn lint`: Check code style
- `yarn format`: Format code
- `yarn db:generate`: Generate database migrations
- `yarn db:push`: Apply migrations
- `yarn db:studio`: Open Drizzle Studio

## 📋 Testing

This project has comprehensive test coverage including unit, integration, and end-to-end tests.

- Unit and integration tests: `yarn test`
- End-to-end tests: `yarn run test:e2e`
- Coverage reports: `yarn run test:coverage`

For detailed information about testing, see [TESTING.md](./TESTING.md).

## 🤝 Contributing

1. Create a new branch
```bash
git checkout -b feature/your-feature
```

2. Make your changes following our guidelines
- Use conventional commits
- Follow the code style (Biome)
- Add tests for new features

3. Create a Pull Request
- Provide a clear description
- Reference related issues
- Ensure all checks pass

## 📄 License

MIT © [Rafael Dias Zendron](https://github.com/rafaumeu)

## 📦 Releases

Our versioning follows [Semantic Versioning](https://semver.org/):
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features
- **Patch** (0.0.X): Bug fixes and minor improvements

Releases are automatically generated based on conventional commits:
- `feat:` triggers a minor version bump
- `fix:` triggers a patch version bump
- `BREAKING CHANGE:` or `!:` triggers a major version bump

### Latest Changes
Check our [releases page](https://github.com/rafaumeu/linkedin-fetcher/releases) for detailed changelog.
