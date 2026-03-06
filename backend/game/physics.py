import numpy as np
import math

def line_to_circle_collision(p1, p2, circle_center, radius):
    """
    STRICT COMPLIANCE: Mathematical line-to-circle intersection logic.
    p1, p2: (x, y) coordinates of the blade segment.
    circle_center: (x, y) coordinates of the fruit/bomb.
    radius: hit-box radius.
    """
    x1, y1 = p1
    x2, y2 = p2
    cx, cy = circle_center

    # Vector from p1 to p2
    dx = x2 - x1
    dy = y2 - y1

    if dx == 0 and dy == 0:
        # Blade segment is a point
        dist = math.sqrt((x1 - cx)**2 + (y1 - cy)**2)
        return dist <= radius

    # Vector from p1 to circle center
    tcx = cx - x1
    tcy = cy - y1

    # Project t onto d
    # Projection factor t: 0.0 to 1.0 covers the segment p1-p2
    t = (tcx * dx + tcy * dy) / (dx**2 + dy**2)

    # Clamp t to stay within the segment
    t = max(0, min(1, t))

    # Closest point on the segment
    closest_x = x1 + t * dx
    closest_y = y1 + t * dy

    # Distance from closest point to circle center
    dist = math.sqrt((closest_x - cx)**2 + (closest_y - cy)**2)

    return dist <= radius

class PhysicsObject:
    def __init__(self, x, y, vx, vy, radius):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.radius = radius
        self.angle = 0
        self.angular_velocity = np.random.uniform(-5, 5)
        self.life_timer = 0  # To track how long it's been alive

    def update(self, gravity):
        self.x += self.vx
        self.y += self.vy
        self.vy += gravity
        self.angle += self.angular_velocity
        self.life_timer += 1

    def get_pos(self):
        return (int(self.x), int(self.y))

class Fruit(PhysicsObject):
    def __init__(self, x, y, vx, vy, radius, fruit_type="generic"):
        super().__init__(x, y, vx, vy, radius)
        self.fruit_type = fruit_type
        self.is_sliced = False

class Bomb(PhysicsObject):
    def __init__(self, x, y, vx, vy, radius):
        super().__init__(x, y, vx, vy, radius)

class SlicedFruit(PhysicsObject):
    def __init__(self, x, y, vx, vy, radius, side="left"):
        super().__init__(x, y, vx, vy, radius)
        self.side = side
        self.fade_alpha = 255

class Particle(PhysicsObject):
    def __init__(self, x, y, vx, vy, radius, color):
        super().__init__(x, y, vx, vy, radius)
        self.color = color
        self.life = 30
