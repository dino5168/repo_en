# Project: repo_en

## Tech Stack

- Runtime: Node.js 20 / Python 3.12
- Frontend: React 18 + Next.js 15 (App Router)
- Backend: FastAPI (Python)
- GIS: Leaflet.js + PostGIS
- DB: PostgreSQL 16
- ORM: Prisma (TypeScript) / SQLAlchemy (Python)

## Commands

### Frontend

npm run dev          # 啟動開發伺服器 (port 3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest

### Backend

uv run fastapi dev   # 啟動 FastAPI (port 8000)
uv run pytest        # 執行測試
uv run ruff check .  # Lint
uv run ruff format . # Format

## Architecture

- /frontend    Next.js App Router
- /backend     FastAPI + PostGIS 空間查詢
- /shared      共用型別定義 (TypeScript)
- /infra       Docker Compose + Nginx

## Git Workflow

- 分支命名：feature/xxx、fix/xxx、chore/xxx
- Commit：Conventional Commits 規範
- PR 合併前必須通過 CI（lint + test）
- 不直接 push main

## Important Notes

- GIS 座標系統統一使用 EPSG:4326
- 空間查詢一律走 PostGIS，不在應用層計算
- /shared/generated/ 為自動產生，不手動修改
- 環境變數統一在 .env.local，不 commit
