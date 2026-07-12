import os
import uuid
import cv2
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.core.config import settings
from app.services.scene_classifier import FootballSceneClassifier

router = APIRouter()

# Global in-memory matches database for local development loop
MATCHES_DB = [
    {
        "id": "match_session_1",
        "title": "Arsenal vs Chelsea - Build-up Sequence",
        "uploaded_at": "2026-07-08T14:00:00Z",
        "status": "analyzed",
        "duration": "12m 45s",
        "resolution": "1920x1080",
        "video_type": "full_match",
        "score": "85%",
        "valid": True,
        "scene": "Open Play",
        "confidence": 0.95,
        "analysisReady": True,
        "error_detail": ""
    },
    {
        "id": "match_session_2",
        "title": "Real Madrid vs Barcelona - Counter Transition",
        "uploaded_at": "2026-07-07T14:00:00Z",
        "status": "processing",
        "duration": "4m 12s",
        "resolution": "1920x1080",
        "video_type": "full_match",
        "score": "Pending",
        "valid": True,
        "scene": "Open Play",
        "confidence": 0.95,
        "analysisReady": True,
        "error_detail": ""
    }
]

@router.get("")
async def list_matches():
    """
    Lists all matches uploaded and validated in the current session.
    """
    return MATCHES_DB

@router.post("/upload")
async def upload_match(
    file: UploadFile = File(...),
    video_type: str = Form("full_match")
):
    # Validate basic extensions
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".mp4", ".mov", ".avi"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Only MP4, MOV, and AVI are allowed."
        )
    
    # Generate unique ID and target path
    video_id = str(uuid.uuid4())
    filename = f"{video_id}{ext}"
    
    # Ensure UPLOAD_DIR exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Save video chunk-by-chunk
    try:
        with open(filepath, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                buffer.write(chunk)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save video: {str(e)}"
        )
    
    # Extract file size
    size_bytes = os.path.getsize(filepath)
    size_mb = size_bytes / (1024 * 1024)
    size_str = f"{size_mb:.2f} MB"
    
    # Extract duration and resolution using OpenCV
    duration_str = "0m 0s"
    resolution_str = "0x0"
    try:
        cap = cv2.VideoCapture(filepath)
        if cap.isOpened():
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            if fps > 0 and frame_count > 0:
                total_seconds = int(frame_count / fps)
                minutes = total_seconds // 60
                seconds = total_seconds % 60
                duration_str = f"{minutes}m {seconds}s"
            
            if width > 0 and height > 0:
                resolution_str = f"{width}x{height}"
            
            cap.release()
    except Exception:
        pass
        
    # Execute Scene Validation Classifier Heuristics
    classifier = FootballSceneClassifier()
    classification = classifier.classify_scene(filepath, video_type)
    
    # Create matching dictionary
    new_match = {
        "id": video_id,
        "title": file.filename,
        "uploaded_at": datetime.utcnow().isoformat() + "Z",
        "status": "pending",
        "duration": duration_str,
        "resolution": resolution_str,
        "video_type": video_type,
        "score": "Pending",
        "valid": classification["valid"],
        "scene": classification["scene"],
        "confidence": classification["confidence"],
        "analysisReady": classification["analysisReady"],
        "error_detail": classification.get("error", "")
    }
    
    # Push into database list
    MATCHES_DB.append(new_match)
    
    return {
        "success": True,
        "video_id": video_id,
        "filename": file.filename,
        "filepath": filepath,
        "size": size_str,
        "duration": duration_str,
        "resolution": resolution_str,
        "video_type": video_type,
        "valid": classification["valid"],
        "scene": classification["scene"],
        "confidence": classification["confidence"],
        "analysisReady": classification["analysisReady"],
        "error_detail": classification.get("error", "")
    }
