# AI Football Intelligence Platform

A production-ready, clean-architecture platform that processes football match videos and delivers AI-powered tactical analytics.

---

## 🌟 Vision & Key Features

The AI Football Intelligence Platform acts as an automated tactical assistant. It allows coaches and analysts to upload matches, automatically track player movements, compute possession, discover team formations, and receive semantic chat-based recommendations from an AI Coach.

### Feature Roadmap
- [x] **Project Foundation**: High-quality modular architecture setup.
- [ ] **Match Upload & Video Streaming**: Safe ingestion and storage of large match reels.
- [ ] **Player & Ball Detection**: Visual tracking using YOLOv11 and ByteTrack.
- [ ] **Possession & Play Networks**: Graph-based passing maps and heatmap visualizations.
- [ ] **AI Tactical Coach (RAG)**: Chat assistant with context retrieved from football manuals, playbook vector databases (ChromaDB), and video metrics.
- [ ] **Automated PDF Match Reports**: Exportable summaries.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router, TypeScript), Tailwind CSS, Shadcn UI, Clerk Auth.
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic settings.
- **AI Core**: OpenCV, YOLOv11 (Ultralytics), ByteTrack, NumPy, Gemini API.
- **Database**: PostgreSQL (Supabase) and ChromaDB (Vector Search).
- **Orchestration & Deploy**: Docker, Docker Compose, Vercel, Railway.

---

## 📁 Repository Structure

We structure the codebase as a monorepo containing decoupled services:

```text
football-ai/
├── backend/            # FastAPI Python backend (services, models, schemas, AI)
├── frontend/           # Next.js TypeScript frontend (pages, components, hooks)
├── docs/               # Technical designs, system architecture and API definitions
├── scripts/            # Database initialization and operations automation scripts
└── docker-compose.yml  # Multi-container orchestration (DB, ChromaDB, Web)
```

For a detailed walkthrough of all directories, please check out [docs/architecture.md](docs/architecture.md).

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
You can start PostgreSQL and ChromaDB containers:
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
