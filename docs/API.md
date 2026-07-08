# API Endpoints Specification

This document details the REST API specifications for version 1 (`/api/v1`) of the **AI Football Intelligence Platform** backend.

---

## Global Headers & Authentication

All protected requests must supply the Clerk JWT authorization header:
```http
Authorization: Bearer <clerk_jwt_token>
```

---

## 1. Health Checks

### `GET /health`
Validates backend system status.

* **Response**: `200 OK`
  ```json
  {
    "status": "healthy",
    "environment": "development",
    "project": "AI Football Intelligence Platform"
  }
  ```

---

## 2. Match Ingestion

### `GET /api/v1/matches`
Lists all uploaded matches for the current authenticated organization/user.

* **Response**: `200 OK`
  ```json
  [
    {
      "id": "match_uuid_1",
      "title": "Arsenal vs Chelsea - First Half",
      "uploaded_at": "2026-07-08T14:00:00Z",
      "status": "completed",
      "video_url": "/uploads/arsenal_chelsea.mp4"
    }
  ]
  ```

### `POST /api/v1/matches/upload`
Uploads a match video file.

* **Request Type**: `multipart/form-data`
* **Form Parameters**:
  - `file`: Video file binary (e.g. mp4, mkv)
  - `title`: String representation of the match
* **Response**: `201 Created`
  ```json
  {
    "id": "match_uuid_1",
    "title": "Arsenal vs Chelsea - First Half",
    "status": "pending",
    "uploaded_at": "2026-07-08T14:05:00Z"
  }
  ```

---

## 3. Analysis & Analytics

### `GET /api/v1/analysis/{match_id}`
Retrieves player tracks, heatmap coords, possession calculations, and passing data.

* **Response**: `200 OK`
  ```json
  {
    "match_id": "match_uuid_1",
    "status": "completed",
    "duration_seconds": 2700,
    "metrics": {
      "possession": {
        "team_a": 58.2,
        "team_b": 41.8
      },
      "pass_accuracy": {
        "team_a": 85.0,
        "team_b": 79.4
      }
    },
    "heatmap_coordinates": [
      {"x": 10.2, "y": 45.3, "weight": 0.8},
      {"x": 15.1, "y": 42.1, "weight": 0.9}
    ]
  }
  ```

### `POST /api/v1/analysis/{match_id}/process`
Triggers the YOLO/ByteTrack background parsing job for the selected match.

* **Response**: `202 Accepted`
  ```json
  {
    "match_id": "match_uuid_1",
    "job_id": "job_uuid_abc",
    "status": "queued"
  }
  ```

---

## 4. AI Coach (RAG Query)

### `POST /api/v1/analysis/{match_id}/chat`
Sends a prompt to the AI Coach. The coach uses the match stats and ChromaDB playbook database to return tactical feedback.

* **Request Body**:
  ```json
  {
    "message": "Why was our left flank exposed during Chelsea counter-attacks?"
  }
  ```
* **Response**: `200 OK`
  ```json
  {
    "reply": "According to the track files, your Left Back (ID 4) averaged a high recovery time (5.4 seconds) and failed to transition back to a compact 4-4-2 block when possession was lost. To mitigate this, consider instructing your left central midfielder to cover the half-spaces when..."
  }
  ```
