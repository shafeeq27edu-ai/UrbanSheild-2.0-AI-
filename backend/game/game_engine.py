import pygame
import random
import time
from .config import *
from .vision_engine import VisionEngine
from .physics import Fruit, Bomb, line_to_circle_collision

class GameEngine:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption("Motion Fruit Ninja")
        self.clock = pygame.time.Clock()
        
        self.vision = VisionEngine()
        self.state = GameState.READY
        
        self.score = 0
        self.lives = MAX_LIVES
        self.combo_count = 0
        self.last_slice_time = 0
        
        self.objects = []
        self.blade_trail = []  # List of (x, y) points
        
        self.font = pygame.font.SysFont("Arial", 32)
        self.title_font = pygame.font.SysFont("Arial", 64, bold=True)

    def reset_game(self):
        self.score = 0
        self.lives = MAX_LIVES
        self.combo_count = 0
        self.objects = []
        self.blade_trail = []
        self.state = GameState.PLAYING

    def spawn_object(self):
        x = random.randint(100, SCREEN_WIDTH - 100)
        y = SCREEN_HEIGHT + 50
        vx = random.uniform(*FRUIT_INIT_VELOCITY_X_RANGE)
        vy = FRUIT_INIT_VELOCITY_Y
        
        if random.random() < BOMB_CHANCE:
            self.objects.append(Bomb(x, y, vx, vy, radius=30))
        else:
            self.objects.append(Fruit(x, y, vx, vy, radius=35))

    def update(self):
        if self.state != GameState.PLAYING:
            return

        # Spawn objects
        if random.random() < 0.02:  # Adjust spawn rate
            self.spawn_object()

        # Update vision
        pos = self.vision.get_pointer_position(SCREEN_WIDTH, SCREEN_HEIGHT)
        if pos:
            self.blade_trail.append(pos)
            if len(self.blade_trail) > 10:
                self.blade_trail.pop(0)
        else:
            self.blade_trail = []

        # Update objects and check collisions
        new_objects = []
        for obj in self.objects:
            obj.update(GRAVITY)
            
            # Check collision with blade segments
            if len(self.blade_trail) >= 2:
                for i in range(len(self.blade_trail) - 1):
                    p1 = self.blade_trail[i]
                    p2 = self.blade_trail[i+1]
                    if line_to_circle_collision(p1, p2, (obj.x, obj.y), obj.radius):
                        self.handle_collision(obj)
                        break
                else:
                    # Only keep objects that haven't been sliced or fallen off
                    if obj.y < SCREEN_HEIGHT + 100:
                        new_objects.append(obj)
                    elif isinstance(obj, Fruit):
                        self.lives -= 1
                        if self.lives <= 0:
                            self.state = GameState.GAME_OVER
            else:
                if obj.y < SCREEN_HEIGHT + 100:
                    new_objects.append(obj)
                elif isinstance(obj, Fruit):
                    self.lives -= 1
                    if self.lives <= 0:
                        self.state = GameState.GAME_OVER
        
        self.objects = new_objects

    def handle_collision(self, obj):
        if isinstance(obj, Bomb):
            self.state = GameState.GAME_OVER
        elif isinstance(obj, Fruit):
            self.score += 1
            # Combo logic
            now = time.time()
            if now - self.last_slice_time < COMBO_WINDOW:
                self.combo_count += 1
                if self.combo_count >= 3:
                    self.score += self.combo_count
            else:
                self.combo_count = 0
            self.last_slice_time = now
            
            # STRIKE/BREAK: Fruit splitting logic
            # Create two halves with diverging velocities
            self.objects.append(SlicedFruit(obj.x, obj.y, obj.vx - SPLIT_VELOCITY_BOOST, obj.vy - 2, obj.radius, side="left"))
            self.objects.append(SlicedFruit(obj.x, obj.y, obj.vx + SPLIT_VELOCITY_BOOST, obj.vy - 2, obj.radius, side="right"))
            
            # Particle burst
            for _ in range(15):
                self.objects.append(Particle(
                    obj.x, obj.y, 
                    random.uniform(-5, 5), random.uniform(-5, 5), 
                    random.randint(2, 5), COLOR_RED
                ))

    def draw(self):
        self.screen.fill(COLOR_BLACK)
        
        if self.state == GameState.READY:
            self.draw_text("MOTION FRUIT NINJA", self.title_font, COLOR_GREEN, (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 - 50))
            self.draw_text("Hold index finger to start", self.font, COLOR_WHITE, (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 + 50))
            
        elif self.state == GameState.PLAYING:
            # Draw objects
            for obj in self.objects:
                if isinstance(obj, Fruit):
                    pygame.draw.circle(self.screen, COLOR_RED, obj.get_pos(), obj.radius)
                    if DEBUG_MODE:
                        pygame.draw.circle(self.screen, COLOR_WHITE, obj.get_pos(), obj.radius, 1) # Hitbox
                elif isinstance(obj, Bomb):
                    pygame.draw.circle(self.screen, COLOR_YELLOW, obj.get_pos(), obj.radius)
                    pygame.draw.circle(self.screen, COLOR_BLACK, obj.get_pos(), obj.radius - 5)
                    if DEBUG_MODE:
                        pygame.draw.circle(self.screen, COLOR_WHITE, obj.get_pos(), obj.radius, 1) # Hitbox
                elif isinstance(obj, SlicedFruit):
                    # Draw semi-circles or just offset circles for now
                    pos = obj.get_pos()
                    offset = -10 if obj.side == "left" else 10
                    pygame.draw.circle(self.screen, COLOR_RED, (pos[0] + offset, pos[1]), obj.radius // 2)
                elif isinstance(obj, Particle):
                    pygame.draw.circle(self.screen, obj.color, obj.get_pos(), obj.radius)
            
            # Draw blade trail with glow
            if len(self.blade_trail) >= 2:
                # Outer glow
                pygame.draw.lines(self.screen, COLOR_BLADE_GLOW, False, self.blade_trail, 10)
                # Inner core
                pygame.draw.lines(self.screen, COLOR_BLADE, False, self.blade_trail, 4)
                
                if DEBUG_MODE:
                    for i in range(len(self.blade_trail) - 1):
                        pygame.draw.line(self.screen, COLOR_WHITE, self.blade_trail[i], self.blade_trail[i+1], 1)
                
            # Draw UI
            self.draw_text(f"Score: {self.score}", self.font, COLOR_WHITE, (100, 50))
            self.draw_text(f"Lives: {self.lives}", self.font, COLOR_RED, (SCREEN_WIDTH - 100, 50))
            if self.combo_count >= 2:
                self.draw_text(f"COMBO X{self.combo_count}!", self.font, COLOR_YELLOW, (SCREEN_WIDTH//2, 50))
            
            if DEBUG_MODE:
                self.draw_text(f"FPS: {int(self.clock.get_fps())}", self.font, COLOR_GREEN, (SCREEN_WIDTH//2, SCREEN_HEIGHT - 30))
                self.draw_text(f"Objects: {len(self.objects)}", self.font, COLOR_GREEN, (100, SCREEN_HEIGHT - 30))
            
        elif self.state == GameState.GAME_OVER:
            # Styled Game Over Screen
            overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
            overlay.fill((20, 0, 0, 180))
            self.screen.blit(overlay, (0,0))
            self.draw_text("GAME OVER", self.title_font, COLOR_RED, (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 - 50))
            self.draw_text(f"Final Score: {self.score}", self.font, COLOR_WHITE, (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 + 50))
            self.draw_text("Wait for cooldown to restart...", self.font, COLOR_YELLOW, (SCREEN_WIDTH//2, SCREEN_HEIGHT//2 + 150))
            
        pygame.display.flip()

    def draw_text(self, text, font, color, pos):
        img = font.render(text, True, color)
        rect = img.get_rect(center=pos)
        self.screen.blit(img, rect)

    def run(self):
        self.vision.start()
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
            
            # Logic for starting/restarting via hand presence
            pos = self.vision.get_pointer_position(SCREEN_WIDTH, SCREEN_HEIGHT)
            if self.state in [GameState.READY, GameState.GAME_OVER]:
                if pos:
                    self.reset_game()

            self.update()
            self.draw()
            self.clock.tick(FPS)
            
        self.vision.stop()
        pygame.quit()

if __name__ == "__main__":
    game = GameEngine()
    game.run()
