import cv2
import mediapipe as mp
import threading
import time
import numpy as np
from .config import CAMERA_WIDTH, CAMERA_HEIGHT, SMOOTHING_FACTOR, FPS

class VisionEngine:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils
        
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)
        
        self.running = False
        self.lock = threading.Lock()
        
        # Shared data
        self.index_finger_pos = None  # (x, y) normalized 0.0 to 1.0
        self.raw_pos = None
        self.last_update_time = time.time()
        
        # Thread handles
        self.thread = None

    def start(self):
        """Starts the vision processing thread."""
        self.running = True
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def stop(self):
        """Stops the vision processing thread."""
        self.running = False
        if self.thread:
            self.thread.join()
        self.cap.release()

    def _run(self):
        """Internal loop for background thread."""
        while self.running:
            success, frame = self.cap.read()
            if not success:
                continue
                
            # Flip frame for mirror effect
            frame = cv2.flip(frame, 1)
            
            # Convert to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb_frame)
            
            new_pos = None
            if results.multi_hand_landmarks:
                # We only care about the first hand (max_num_hands=1)
                hand_landmarks = results.multi_hand_landmarks[0]
                
                # INDEX_FINGER_TIP is landmark 8
                tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
                new_pos = (tip.x, tip.y)
                
            with self.lock:
                if new_pos:
                    if self.index_finger_pos is None:
                        self.index_finger_pos = new_pos
                    else:
                        # Apply smoothing (Exponential Moving Average)
                        self.index_finger_pos = (
                            self.index_finger_pos[0] * (1 - SMOOTHING_FACTOR) + new_pos[0] * SMOOTHING_FACTOR,
                            self.index_finger_pos[1] * (1 - SMOOTHING_FACTOR) + new_pos[1] * SMOOTHING_FACTOR
                        )
                else:
                    self.index_finger_pos = None
                
                self.last_update_time = time.time()

            # Optional: Add small sleep to cap thread frequency if needed, 
            # but ideally it runs as fast as the camera allows.
            time.sleep(0.001)

    def get_pointer_position(self, screen_w, screen_h):
        """Returns the current smoothed pointer position in screen coordinates."""
        with self.lock:
            if self.index_finger_pos:
                return (
                    int(self.index_finger_pos[0] * screen_w),
                    int(self.index_finger_pos[1] * screen_h)
                )
        return None
