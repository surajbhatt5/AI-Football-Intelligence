# System Architecture Design

This document details the software design, patterns, and component relationships of the **AI Football Intelligence Platform**.

---

## Component Diagram

```mermaid
graph TD
    Client[Next.js App Client] <--> |HTTPS / Auth| Clerk[Clerk Auth Provider]
    Client <--> |JSON API / REST| Backend[FastAPI App Server]
    
    subgraph Backend Core
        Backend <--> |SQLModel / SQLAlchemy| DB[(Supabase PostgreSQL)]
        Backend <--> |HTTP client| VectorDB[(ChromaDB Vector Store)]
        Backend <--> |Gemini SDK| Gemini[Gemini API]
        Backend --> |Local or S3 Storage| Disk[(Match Storage)]
        Backend --> |Worker pipeline| AI[AI Tracker / YOLOv11 Engine]
    end

    subgraph AI Module Pipeline
        AI --> |Frame extraction| OpenCV[OpenCV Frame Reader]
        OpenCV --> |Bounding boxes| YOLO[YOLOv11 Detector]
        YOLO --> |ID tracking| ByteTrack[ByteTrack Tracker]
        ByteTrack --> |Spatial Math| Analytics[Possession & Pass Math]
    end
```

---

## Key Design Principles

1. **Clean Architecture (Decoupled Infrastructure)**
   The core domain logic of the application (located under `backend/app/services`) is independent of database adapters, ML libraries, or framework endpoints. We define interfaces so that PostgreSQL or S3 layers can be replaced with minimal friction.

2. **SOLID Design Principles**
   - **Single Responsibility Principle (SRP)**: Each router endpoint delegates all validation to Pydantic, all database transformations to Repository classes, and all business rules to Service classes.
   - **Interface Segregation**: The AI module isolates OpenCV and YOLO specific libraries behind clean wrapper classes (`Detector`, `Tracker`, `Analyzer`), ensuring the web application doesn't bleed computer-vision types.

3. **Multi-Stage Processing (Video Ingestion to Insights)**
   - **Phase 1: Ingestion**: Raw video uploaded -> safe storage on cloud buckets -> Database metadata creation.
   - **Phase 2: Inference**: Video frames run through YOLOv11 & ByteTrack -> tracks generated.
   - **Phase 3: Tactical Computations**: Spatial calculations -> heatmaps, pass vectors, possession matrices.
   - **Phase 4: LLM Coaching Integration**: Tactical data vectorized -> stored in ChromaDB -> Gemini LLM utilizes RAG context to output match feedback.
