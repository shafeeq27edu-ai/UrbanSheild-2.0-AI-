# Debugging and Execution Guide

## Setup
1. Ensure you have Python 3.x installed.
2. Install dependencies:
   ```bash
   pip install pygame mediapipe opencv-python numpy
   ```

## Running the Game
Run the game using the following command from the root directory:
```bash
python -m backend.game.game_engine
```

## Debug Modes
The behavior of the game can be adjusted in `backend/game/config.py`:

- **DEBUG_PREVIEW**: 
  - Set to `True` to open a window showing the camera feed.
  - Useful for verifying hand tracking and landmark detection.
  - Press 'q' in the preview window to stop vision processing (this may affect the game).

- **DEBUG_MODE**:
  - Set to `True` to see object hitboxes and real-time FPS counter.
  - Useful for verifying collision detection and performance.

## Common Issues
- **Camera not detected**: Ensure no other application is using the camera.
- **Low FPS**: Check `CAMERA_WIDTH` and `CAMERA_HEIGHT` in `config.py`. Standards require <= 640x480.
- **Hand not tracking**: Ensure hand is clearly visible and lighting is adequate.
