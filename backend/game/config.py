import os

# --- ARCHITECTURE DISCIPLINE ---
# Centralized configuration to avoid magic numbers and maintain modularity.

# Window and Camera settings
SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
CAMERA_WIDTH = 640
CAMERA_HEIGHT = 480
FPS = 60

# Colors (Consistent and vibrant)
COLOR_WHITE = (255, 255, 255)
COLOR_BLACK = (0, 0, 0)
COLOR_RED = (255, 50, 50)
COLOR_GREEN = (50, 255, 50)
COLOR_BLUE = (50, 50, 255)
COLOR_YELLOW = (255, 255, 50)
COLOR_BLADE = (0, 200, 255)  # Glowing cyan
COLOR_BLADE_GLOW = (100, 230, 255)

# Game Physics
GRAVITY = 0.25
FRUIT_INIT_VELOCITY_Y = -12
FRUIT_INIT_VELOCITY_X_RANGE = (-3, 3)
SPLIT_VELOCITY_BOOST = 2

# Motion Detection Standards
VELOCITY_THRESHOLD = 50       # Min pixels/frame to be considered a slice
MIN_PATH_LENGTH = 30         # Min length of a swipe
DIRECTION_STABILITY = 0.8    # Filter for directional consistency
COOLDOWN_TIMER = 0.2         # Seconds between allowed slices for same object
SMOOTHING_FACTOR = 0.4       # Moving average for blade trail

# Gameplay Rules
MAX_LIVES = 3
COMBO_WINDOW = 0.4           # Seconds
BOMB_CHANCE = 0.15           # Probability of spawning a bomb

# Asset Paths
ASSETS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "assets")
SOUNDS_DIR = os.path.join(ASSETS_DIR, "sounds")
IMAGES_DIR = os.path.join(ASSETS_DIR, "images")

# States
class GameState:
    READY = "READY"
    PLAYING = "PLAYING"
    GAME_OVER = "GAME_OVER"
# Debugging and Exploration
DEBUG_PREVIEW = True        # Show vision module preview window
DEBUG_MODE = True           # Show hitboxes and FPS in game
