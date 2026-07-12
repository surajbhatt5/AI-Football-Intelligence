import os
import cv2
import json
import time
import logging
from ultralytics import YOLO
from app.core.config import settings
from app.services.video_processor import PROCESSING_STATUS

logger = logging.getLogger(__name__)

class PlayerDetector:
    def __init__(self):
        # Load YOLOv8 nano model (downloads automatically on first load, ~6MB)
        self.model = YOLO("yolov8n.pt")

    def detect_players(self, video_id: str):
        """
        Processes extracted JPEGs inside processing/{video_id}/frames/, runs YOLOv8 person detection,
        saves annotated bounding-box JPEGs and JSON metadata to processing/{video_id}/detections/,
        and writes a unified summary.json file.
        """
        logger.info(f"Starting player detection inference for match_id={video_id}")
        start_time = time.time()
        
        # Initialize or update status dictionary stage
        if video_id not in PROCESSING_STATUS:
            PROCESSING_STATUS[video_id] = {}
            
        PROCESSING_STATUS[video_id].update({
            "status": "processing",
            "stage": "detection",
            "frames_processed": 0,
            "percentage": 50
        })

        processing_dir = os.path.join(settings.PROCESSING_DIR, video_id)
        frames_dir = os.path.join(processing_dir, "frames")
        detections_dir = os.path.join(processing_dir, "detections")
        
        # Ensure directories exist
        os.makedirs(detections_dir, exist_ok=True)
        
        if not os.path.exists(frames_dir):
            logger.error(f"Frames directory does not exist for session {video_id} at: {frames_dir}")
            PROCESSING_STATUS[video_id]["status"] = "failed"
            PROCESSING_STATUS[video_id]["error"] = "Extraction frame directory was not found on disk."
            return

        # Find and sort all JPEGs in the frames folder
        frame_files = sorted([f for f in os.listdir(frames_dir) if f.lower().endswith((".jpg", ".jpeg"))])
        total_frames = len(frame_files)
        
        if total_frames == 0:
            logger.error(f"No frames found for player detection processing inside: {frames_dir}")
            PROCESSING_STATUS[video_id]["status"] = "failed"
            PROCESSING_STATUS[video_id]["error"] = "Extraction directory contains 0 image frames."
            return
            
        PROCESSING_STATUS[video_id]["total_frames"] = total_frames
        
        # Stats accumulators
        total_players_detected = 0
        total_confidence = 0.0
        players_analyzed_count = 0
        failed_frames = []
        
        for idx, filename in enumerate(frame_files):
            frame_path = os.path.join(frames_dir, filename)
            frame_num = int(filename.split("_")[1].split(".")[0]) if "_" in filename else idx
            
            try:
                # Load frame
                img = cv2.imread(frame_path)
                if img is None:
                    raise ValueError(f"Failed to read image frame: {filename}")
                    
                # Run YOLO person class detection (classes=[0] filters for 'person')
                results = self.model(img, classes=[0], verbose=False)
                res = results[0]
                
                detected_players = []
                annotated_img = img.copy()
                
                for box_idx, box in enumerate(res.boxes):
                    conf = float(box.conf[0])
                    coords = [float(c) for c in box.xyxy[0]] # [x1, y1, x2, y2]
                    
                    detected_players.append({
                        "player_id": box_idx + 1,
                        "confidence": conf,
                        "bbox": coords
                    })
                    
                    total_confidence += conf
                    total_players_detected += 1
                    
                    # Draw green bounding box overlays
                    x1, y1, x2, y2 = map(int, coords)
                    cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(
                        annotated_img,
                        f"P {conf:.2f}",
                        (x1, y1 - 5),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.4,
                        (0, 255, 0),
                        1
                    )
                    
                # Save annotated frame image
                annotated_path = os.path.join(detections_dir, filename)
                cv2.imwrite(annotated_path, annotated_img, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
                
                # Save individual frame JSON results log
                frame_json = {
                    "frame_number": frame_num,
                    "detected_players": detected_players
                }
                
                basename = os.path.splitext(filename)[0]
                json_path = os.path.join(detections_dir, f"{basename}.json")
                with open(json_path, "w") as f:
                    json.dump(frame_json, f, indent=2)
                    
                players_analyzed_count += 1
                
            except Exception as e:
                logger.error(f"Error processing frame {filename} inside detector loop: {str(e)}")
                failed_frames.append(filename)
                
            # Update background status percentage (scales from 50% to 100%)
            processed_so_far = idx + 1
            pct = 50 + int((processed_so_far * 50) / total_frames)
            
            # Throttle progress logs
            if processed_so_far % 30 == 0 or processed_so_far == total_frames:
                PROCESSING_STATUS[video_id]["frames_processed"] = processed_so_far
                PROCESSING_STATUS[video_id]["percentage"] = pct
                logger.info(f"Player Detection {video_id} progress: {pct}% ({processed_so_far}/{total_frames})")

        elapsed_time = time.time() - start_time
        
        # Calculate summaries metrics
        avg_players = (total_players_detected / players_analyzed_count) if players_analyzed_count > 0 else 0.0
        avg_confidence = (total_confidence / total_players_detected) if total_players_detected > 0 else 0.0
        
        summary = {
            "total_frames_processed": total_frames,
            "average_players_detected_per_frame": round(avg_players, 2),
            "average_confidence": round(avg_confidence, 2),
            "processing_time_seconds": round(elapsed_time, 2),
            "failed_frames": failed_frames
        }
        
        # Write summary.json
        summary_path = os.path.join(detections_dir, "summary.json")
        with open(summary_path, "w") as f:
            json.dump(summary, f, indent=2)
            
        # Complete task status
        PROCESSING_STATUS[video_id]["status"] = "completed"
        PROCESSING_STATUS[video_id]["percentage"] = 100
        PROCESSING_STATUS[video_id]["frames_processed"] = total_frames
        logger.info(f"Successfully finished player detection for match {video_id}. summary.json written.")
