import os
import cv2
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

# Global in-memory dictionary to store real-time progress of ongoing extractions
PROCESSING_STATUS = {}

class VideoProcessor:
    def process_video(self, video_id: str, filepath: str, frame_interval: int = 1):
        """
        Loads the video, extracts properties, saves JPEG frames to processing/{video_id}/frames/
        at frame_interval steps, and writes the completed metadata.json parameters.
        """
        logger.info(f"Initializing frame extraction background task: match_id={video_id}")
        
        # Initialize progress tracker fields
        PROCESSING_STATUS[video_id] = {
            "status": "processing",
            "frames_processed": 0,
            "total_frames": 0,
            "percentage": 0,
            "fps": 0,
            "resolution": "0x0"
        }
        
        cap = cv2.VideoCapture(filepath)
        if not cap.isOpened():
            logger.error(f"Failed to open source match video at path: {filepath}")
            PROCESSING_STATUS[video_id]["status"] = "failed"
            PROCESSING_STATUS[video_id]["error"] = "Failed to open source match video."
            return
            
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        if fps <= 0 or frame_count <= 0:
            logger.error(f"Failed to extract properties: FPS={fps}, total_frames={frame_count}")
            PROCESSING_STATUS[video_id]["status"] = "failed"
            PROCESSING_STATUS[video_id]["error"] = "Unsupported codec or corrupt frames."
            cap.release()
            return
            
        duration_seconds = frame_count / fps
        resolution_str = f"{width}x{height}"
        
        PROCESSING_STATUS[video_id]["total_frames"] = frame_count
        PROCESSING_STATUS[video_id]["fps"] = int(fps)
        PROCESSING_STATUS[video_id]["resolution"] = resolution_str
        
        # Set up processing directory paths
        processing_dir = os.path.join(settings.PROCESSING_DIR, video_id)
        frames_dir = os.path.join(processing_dir, "frames")
        os.makedirs(frames_dir, exist_ok=True)
        
        extracted_count = 0
        frame_idx = 0
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret or frame is None:
                    break
                    
                if frame_idx % frame_interval == 0:
                    frame_filename = f"frame_{frame_idx:06d}.jpg"
                    frame_path = os.path.join(frames_dir, frame_filename)
                    # Write with standard quality compression to maintain detail and save disk size
                    cv2.imwrite(frame_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
                    extracted_count += 1
                    
                frame_idx += 1
                
                # Throttle progress reporting updates to avoid CPU lockups
                if frame_idx % 30 == 0 or frame_idx == frame_count:
                    pct = int((frame_idx * 100) / frame_count)
                    PROCESSING_STATUS[video_id]["frames_processed"] = frame_idx
                    PROCESSING_STATUS[video_id]["percentage"] = pct
                    logger.debug(f"Processing progress {video_id}: {pct}% ({frame_idx}/{frame_count})")
                    
            cap.release()
            
            # Write final metadata.json parameters file
            metadata = {
                "video_id": video_id,
                "fps": float(fps),
                "width": width,
                "height": height,
                "duration_seconds": float(duration_seconds),
                "total_frames": frame_count,
                "extracted_frames": extracted_count,
                "frame_interval": frame_interval,
                "status": "completed"
            }
            metadata_path = os.path.join(processing_dir, "metadata.json")
            with open(metadata_path, "w") as f:
                json.dump(metadata, f, indent=2)
                
            # Set completed state
            PROCESSING_STATUS[video_id]["status"] = "completed"
            PROCESSING_STATUS[video_id]["percentage"] = 100
            PROCESSING_STATUS[video_id]["frames_processed"] = frame_count
            logger.info(f"Successfully processed match {video_id}. Total JPEG frames saved: {extracted_count}")
            
        except Exception as e:
            logger.error(f"Error during video frames extraction loop: {str(e)}")
            PROCESSING_STATUS[video_id]["status"] = "failed"
            PROCESSING_STATUS[video_id]["error"] = str(e)
            if cap.isOpened():
                cap.release()
