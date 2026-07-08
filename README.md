# AI Football Intelligence Platform ⚽🤖

A production-quality, clean-architecture platform that processes football match videos and delivers AI-powered tactical analytics. This monorepo hosts both the Next.js TypeScript frontend and FastAPI Python backend.

---

## 🌟 Vision & Key Features

The AI Football Intelligence Platform acts as an automated tactical assistant. It allows coaches and analysts to upload matches, automatically track player movements, compute possession, discover team formations, and receive semantic chat-based recommendations from an AI Coach.

### Feature Roadmap
- [x] **Project Foundation**: High-quality modular architecture setup.
- [ ] **Match Ingestion & Streaming**: Safe uploads, metadata management, and local/cloud storage.
- [ ] **Player & Ball Detection**: Visual tracking using YOLOv11 and ByteTrack.
- [ ] **Possession & Play Networks**: Graph-based passing maps and heatmap visualizations.
- [ ] **AI Tactical Coach (RAG)**: Chat assistant utilizing vector playbooks (ChromaDB) and video metrics.
- [ ] **Automated PDF Match Reports**: Exportable summaries.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router, TypeScript), Tailwind CSS, Shadcn UI, Clerk Auth.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic settings.
- **AI Core**: OpenCV, YOLOv11 (Ultralytics), ByteTrack, NumPy, Gemini API.
- **Database**: PostgreSQL (Supabase) and ChromaDB (Vector Search).
- **Orchestration & Deploy**: Docker, Docker Compose, Vercel, Railway.

---

## 📁 Repository Structure

We adhere to **Clean Architecture** patterns, separating the application layer, domain/business logic, and infrastructure/database dependencies.

```text
football-ai/
├── backend/                         # FastAPI Backend Application
│   ├── app/                         # Core Python package
│   │   ├── main.py                  # Entrypoint for FastAPI
│   │   ├── api/                     # API Routing and Endpoints
│   │   │   ├── deps.py              # Common API dependencies (auth, db)
│   │   │   └── v1/                  # API version 1 router
│   │   │       ├── api.py           # V1 router aggregation
│   │   │       └── endpoints/       # Endpoint-specific handlers
│   │   │           ├── matches.py   # Match uploads and list endpoints
│   │   │           └── analysis.py  # Analysis results retrieval
│   │   ├── core/                    # Application Configuration and Security
│   │   │   ├── config.py            # Pydantic BaseSettings env loader
│   │   │   └── logging.py           # Logging configuration
│   │   ├── db/                      # Database Connections and Sessions
│   │   │   ├── session.py           # PostgreSQL/SQLAlchemy connection setup
│   │   │   ├── base.py              # Base declaration for models (SQLAlchemy)
│   │   │   └── vector_store.py      # ChromaDB vector store initialization
│   │   ├── models/                  # Database Models (SQLAlchemy ORM)
│   │   │   ├── match.py             # Match video metadata model
│   │   │   └── analysis.py          # Analysis results metadata model
│   │   ├── schemas/                 # Pydantic Schemas (Request/Response)
│   │   │   ├── match.py
│   │   │   └── analysis.py
│   │   ├── services/                # Business Logic / Use Cases
│   │   │   ├── match.py             # Service logic for match handling
│   │   │   └── analysis.py          # Service logic for initiating analysis
│   │   ├── ai/                      # AI Processing Module (Placeholder)
│   │   │   ├── detector.py          # Player & ball detection wrapper
│   │   │   ├── tracker.py           # ByteTrack integration wrapper
│   │   │   └── analyzer.py          # Heatmaps and tactic extractors
│   │   └── utils/                   # Shared backend utility functions
│   │       └── file_handler.py      # Local/Cloud video storage utilities
│   ├── tests/                       # Automated Backend Tests
│   │   ├── conftest.py              # Pytest configuration and fixtures
│   │   ├── api/                     # API endpoint tests
│   │   └── services/                # Business logic tests
│   ├── Dockerfile                   # Docker configuration for backend
│   ├── requirements.txt             # Python dependencies
│   ├── pyproject.toml               # Formatters/linters config (Black, Ruff)
│   └── .env.example                 # Template for backend local secrets
│
├── frontend/                        # Next.js Frontend Application
│   ├── src/                         # Application source code
│   │   ├── app/                     # App Router Structure
│   │   │   ├── layout.tsx           # Global root layout (Clerk provider)
│   │   │   ├── page.tsx             # Public landing page
│   │   │   └── dashboard/           # Dashboard Layout and Pages
│   │   │       ├── layout.tsx       # Sidebar, navigation and layout
│   │   │       ├── page.tsx         # Dashboard main page (Metrics overview)
│   │   │       ├── upload/          # Match video upload screen
│   │   │       │   └── page.tsx
│   │   │       └── analysis/        # Interactive Match Analysis Screen
│   │   │           └── [matchId]/
│   │   │               └── page.tsx
│   │   ├── components/              # Modular UI Components
│   │   │   ├── ui/                  # Shadcn primitive elements (buttons, inputs)
│   │   │   ├── dashboard/           # Specific dashboard layout views
│   │   │   ├── analysis/            # Custom video player & visualization components
│   │   │   └── shared/              # Header, footer, and utility components
│   │   ├── config/                  # Frontend Configuration Constants
│   │   │   └── site.ts
│   │   ├── hooks/                   # Custom React Hooks
│   │   │   └── use-api.ts           # Fetching / caching hook wrappers
│   │   ├── lib/                     # Client Initializations
│   │   │   ├── utils.ts             # Tailwind class merges (cn)
│   │   │   └── api-client.ts        # Axios/Fetch backend wrapper
│   │   ├── services/                # API Service Calls Layer
│   │   │   ├── match-service.ts
│   │   │   └── analysis-service.ts
│   │   ├── styles/                  # Styling & Globals
│   │   │   └── globals.css          # Tailwind and custom utility styles
│   │   └── types/                   # Shared TypeScript Interfaces
│   │       └── index.ts
│   ├── public/                      # Static assets (images, vectors)
│   ├── Dockerfile                   # Docker configuration for frontend
│   ├── package.json                 # Node.js manifest
│   ├── tsconfig.json                # TypeScript settings
│   ├── tailwind.config.js           # Tailwind utility config
│   ├── next.config.js               # Next.js configurations
│   ├── components.json              # Shadcn CLI setup configuration
│   └── .env.example                 # Template for frontend local variables
│
├── docs/                            # Documentation
│   ├── architecture.md              # Software design & diagram docs
│   └── API.md                       # API endpoints documentation
├── scripts/                         # Platform operations & setup scripts
│   └── seed_db.sh                   # Shell script to seed PostgreSQL
├── docker-compose.yml               # Development Orchestration config
└── .gitignore                       # Global git ignores
```

For detailed architectural flowcharts and data maps, see [docs/architecture.md](docs/architecture.md). For HTTP REST routes, see [docs/API.md](docs/API.md).

---

## 🚀 Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Step 1: Clone and Configure Environment Files
1. Copy backend config template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Copy frontend config template:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

### Step 2: Spin Up Infrastructure Containers
You can start PostgreSQL and ChromaDB containers locally:
```bash
docker compose up -d db chromadb
```

### Step 3: Run FastAPI Backend
1. Create a virtual environment and activate it:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   ```
2. Install packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
4. Verify the server is running at [http://localhost:8000/health](http://localhost:8000/health).

### Step 4: Run Next.js Frontend
1. Install node dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to preview.

---

## 🧪 Running Tests

### Backend Tests
Execute Python tests using pytest:
```bash
cd backend
pytest
```
