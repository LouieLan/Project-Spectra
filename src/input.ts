// Global game input manager supporting keyboard, touch, and gamepad/virtual controls

class InputManager {
  public left = false;
  public right = false;
  public jump = false;
  public jumpJustPressed = false;
  public jumpBufferTimer = 0; // jump buffer in seconds
  public splitMergePressed = false;
  public resetPressed = false;
  public switchTargetPressed = false;
  public targetCharacterColor: string | null = null;

  private listenersAttached = false;

  constructor() {
    this.attach();
  }

  public attach() {
    if (this.listenersAttached || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on Space and Arrow keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') {
        this.left = true;
      }
      if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') {
        this.right = true;
      }
      if (
        code === 'Space' ||
        code === 'ArrowUp' ||
        code === 'KeyW' ||
        key === ' ' ||
        key === 'spacebar' ||
        key === 'arrowup' ||
        key === 'w'
      ) {
        if (!this.jump) {
          this.jumpJustPressed = true;
          this.jumpBufferTimer = 0.2; // 200ms jump buffer
        }
        this.jump = true;
      }
      if (code === 'KeyE' || key === 'e') {
        this.splitMergePressed = true;
      }
      if (code === 'KeyR' || key === 'r') {
        this.resetPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') {
        this.left = false;
      }
      if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') {
        this.right = false;
      }
      if (
        code === 'Space' ||
        code === 'ArrowUp' ||
        code === 'KeyW' ||
        key === ' ' ||
        key === 'spacebar' ||
        key === 'arrowup' ||
        key === 'w'
      ) {
        this.jump = false;
        this.jumpJustPressed = false;
      }
    };

    const handleBlur = () => {
      this.reset();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    this.listenersAttached = true;
  }

  public setLeft(pressed: boolean) {
    this.left = pressed;
  }

  public setRight(pressed: boolean) {
    this.right = pressed;
  }

  public setJump(pressed: boolean) {
    if (pressed && !this.jump) {
      this.jumpJustPressed = true;
      this.jumpBufferTimer = 0.2;
    }
    if (!pressed) {
      this.jumpJustPressed = false;
    }
    this.jump = pressed;
  }

  public triggerJump() {
    this.jumpJustPressed = true;
    this.jumpBufferTimer = 0.2;
  }

  public triggerSplitMerge() {
    this.splitMergePressed = true;
  }

  public triggerReset() {
    this.resetPressed = true;
  }

  public triggerSwitchTarget() {
    this.switchTargetPressed = true;
  }

  public setTargetCharacter(target: string) {
    this.targetCharacterColor = target;
  }

  public consumeSplitMerge(): boolean {
    if (this.splitMergePressed) {
      this.splitMergePressed = false;
      return true;
    }
    return false;
  }

  public consumeReset(): boolean {
    if (this.resetPressed) {
      this.resetPressed = false;
      return true;
    }
    return false;
  }

  public consumeSwitchTarget(): boolean {
    if (this.switchTargetPressed) {
      this.switchTargetPressed = false;
      return true;
    }
    return false;
  }

  public consumeDirectTarget(): string | null {
    if (this.targetCharacterColor !== null) {
      const t = this.targetCharacterColor;
      this.targetCharacterColor = null;
      return t;
    }
    return null;
  }

  public isJumpRequested(): boolean {
    return this.jumpJustPressed || this.jumpBufferTimer > 0;
  }

  public consumeJump() {
    this.jumpJustPressed = false;
    this.jumpBufferTimer = 0;
  }

  public consumeJumpBuffer(): boolean {
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer = 0;
      return true;
    }
    return false;
  }

  public update(dt: number) {
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
      if (this.jumpBufferTimer < 0) this.jumpBufferTimer = 0;
    }
  }

  public reset() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpJustPressed = false;
    this.splitMergePressed = false;
    this.resetPressed = false;
    this.switchTargetPressed = false;
    this.targetCharacterColor = null;
    this.jumpBufferTimer = 0;
  }
}

export const input = new InputManager();
