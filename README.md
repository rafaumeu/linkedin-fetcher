# 🔗 LinkedIn Fetcher

<div align="center">

A modern authentication and scraping system for LinkedIn, built with Fastify and TypeScript.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-Latest-black.svg)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-6.3.0-2D3748.svg)](https://www.postgresql.org/)
[![Codecov](https://img.shields.io/codecov/c/github/rafaumeu/linkedin-fetcher)](https://codecov.io/gh/rafaumeu/linkedin-fetcher)
[![CI](https://github.com/rafaumeu/linkedin-fetcher/actions/workflows/ci.yml/badge.svg)](https://github.com/rafaumeu/linkedin-fetcher/actions/workflows/ci.yml)

---

## 📖 Table of Contents

| [Features](#-features) | [Tech Stack](#-tech-stack) | [Development Tools](#-development-tools) |
|----------------------|---------------------------|------------------------------------------|
| [Prerequisites](#-prerequisites) | [Setup](#️-setup) | [Environment Variables](#-environment-variables) |
| [Project Structure](#️-project-structure) | [Contributing](#-contributing) |

---

</div>

## 🚀 Features

### LinkedIn Integration

- **Profile Fetching**:
  - Fetch LinkedIn profiles with OAuth authentication.
  - Secure token management.

### User Management

- **Profile System**:
  - Custom user profiles.
  - Session management with NextAuth.js.

### Data Handling

- **Efficient Data Management**:
  - Zod for data validation.
  - Real-time data synchronization.

## ⚡ Tech Stack

![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-2D3748?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🛠 Development Tools

![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

---

## 🔄 CI/CD Pipeline

### Continuous Integration

Our CI pipeline automatically runs on every push and pull request:

- **Code Quality Checks**:
  - TypeScript type checking.
  - ESLint for code style.
  - Biome formatting validation.

- **Testing Strategy**:
  - Unit tests with Vitest.

### Workflow Files

- `ci.yml`: Main CI pipeline.
- `project-automation.yml`: Project board automation.

To view the workflow runs, visit the [Actions tab](https://github.com/rafaumeu/linkedin-fetcher/actions) in the repository.

---

## 📦 Prerequisites

- Node.js 20+ (LTS version)
- Yarn package manager
- PostgreSQL (production) / SQLite (development)

## 🛠️ Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/rafaumeu/linkedin-fetcher.git
   cd linkedin-fetcher
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the development environment:

   ```bash
   yarn dev  # Start development server
   ```

## 🔧 Environment Variables

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/linkedin-fetcher"

# LinkedIn OAuth
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

## 🏗️ Project Structure

```
linkedin-fetcher/
├── src/
│   ├── @types/
│   ├── pages/
│   ├── components/
│   ├── lib/
│   └── styles/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── biome.json
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
Made with ❤️ by Rafael Dias Zendron

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rafael-dias-zendron-528290132/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rafaumeu)
</div>
