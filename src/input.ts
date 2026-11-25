// Global game input manager supporting keyboard, touch, and gamepad/joystick controls

export interface GamepadStatus {
  connected: boolean;
  name: string | null;
}

type GamepadListener = (status: GamepadStatus) => void;

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

  // Separate input sources so keyboard, touch, and gamepad never overwrite each other
  private kbLeft = false;
  private kbRight = false;
  private kbJump = false;

  private touchLeft = false;
  private touchRight = false;
  private touchJump = false;

  private gpLeft = false;
  private gpRight = false;
  private gpJump = false;

  private listenersAttached = false;
  private menuMode = true;
  private rafId: number | null = null;
  private lastPollTime = 0;

  // Gamepad connection status
  private gamepadStatus: GamepadStatus = { connected: false, name: null };
  private gamepadListeners = new Set<GamepadListener>();

  // Previous frame button states for edge detection
  private prevGpJump = false;
  private prevBtnA = false;
  private prevBtnB = false;
  private prevBtnRestart = false;
  private prevBtnStart = false;

  // Directional repeat state in menu mode
  private activeMenuDir: 'up' | 'down' | 'left' | 'right' | null = null;
  private menuDirHoldTimer = 0;
  private menuDirRepeatTimer = 0;

  constructor() {
    this.attach();
  }

  private syncCombined() {
    this.left = this.kbLeft || this.touchLeft || this.gpLeft;
    this.right = this.kbRight || this.touchRight || this.gpRight;
    this.jump = this.kbJump || this.touchJump || this.gpJump;
  }

  public setMenuMode(active: boolean) {
    if (this.menuMode !== active) {
      this.menuMode = active;
      // Clear movement states when switching between menu and gameplay
      this.gpLeft = false;
      this.gpRight = false;
      this.gpJump = false;
      this.activeMenuDir = null;
      this.menuDirHoldTimer = 0;
      this.menuDirRepeatTimer = 0;
      this.syncCombined();
    }
  }

  public getGamepadStatus(): GamepadStatus {
    return this.gamepadStatus;
  }

  public subscribeGamepad(listener: GamepadListener): () => void {
    this.gamepadListeners.add(listener);
    listener(this.gamepadStatus);
    return () => {
      this.gamepadListeners.delete(listener);
    };
  }

  private notifyGamepadListeners(status: GamepadStatus) {
    if (
      this.gamepadStatus.connected === status.connected &&
      this.gamepadStatus.name === status.name
    ) {
      return;
    }
    this.gamepadStatus = status;
    this.gamepadListeners.forEach((cb) => cb(status));
  }

  public attach() {
    if (this.listenersAttached || typeof window === 'undefined') return;

    const isEditableElement = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableElement(e.target)) return;

      // Prevent scrolling on Space and Arrow keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') {
        this.kbLeft = true;
      }
      if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') {
        this.kbRight = true;
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
        if (!this.kbJump && !this.jump) {
          this.jumpJustPressed = true;
          this.jumpBufferTimer = 0.2; // 200ms jump buffer
        }
        this.kbJump = true;
      }
      if (code === 'KeyE' || key === 'e') {
        this.splitMergePressed = true;
      }
      if (code === 'KeyR' || key === 'r') {
        this.resetPressed = true;
      }

      this.syncCombined();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') {
        this.kbLeft = false;
      }
      if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') {
        this.kbRight = false;
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
        this.kbJump = false;
        if (!this.touchJump && !this.gpJump) {
          this.jumpJustPressed = false;
        }
      }

      this.syncCombined();
    };

    const handleBlur = () => {
      this.reset();
    };

    const handleGamepadConnected = (e: GamepadEvent) => {
      this.notifyGamepadListeners({
        connected: true,
        name: this.formatGamepadName(e.gamepad.id),
      });
    };

    const handleGamepadDisconnected = () => {
      const active = this.findActiveGamepad();
      if (active) {
        this.notifyGamepadListeners({
          connected: true,
          name: this.formatGamepadName(active.id),
        });
      } else {
        this.gpLeft = false;
        this.gpRight = false;
        this.gpJump = false;
        this.syncCombined();
        this.notifyGamepadListeners({ connected: false, name: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    this.listenersAttached = true;
    this.startGamepadPolling();
  }

  private formatGamepadName(rawId: string): string {
    // Strip verbose vendor/product IDs like "(STANDARD GAMEPAD Vendor: 045e Product: 02ea)"
    const cleaned = rawId.replace(/\s*\([^)]*Vendor:[^)]*\)/i, '').trim();
    return cleaned || 'Gamepad';
  }

  private findActiveGamepad(): Gamepad | null {
    if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
      return null;
    }
    const pads = navigator.getGamepads();
    if (!pads) return null;
    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      if (pad && pad.connected) return pad;
    }
    return null;
  }

  private startGamepadPolling() {
    if (this.rafId !== null || typeof window === 'undefined') return;
    this.lastPollTime = performance.now();

    const poll = (now: number) => {
      this.rafId = requestAnimationFrame(poll);
      const dt = Math.min((now - this.lastPollTime) / 1000, 0.1);
      this.lastPollTime = now;
      this.pollGamepad(dt);
    };

    this.rafId = requestAnimationFrame(poll);
  }

  private dispatchSyntheticKey(key: string, code: string): boolean {
    const ev = new KeyboardEvent('keydown', {
      key,
      code,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(ev);
    return ev.defaultPrevented;
  }

  private getFocusableElements(): HTMLElement[] {
    // Prefer elements inside the topmost modal if one is open
    const modals = Array.from(document.querySelectorAll('.fixed.inset-0'));
    const container: ParentNode =
      modals.length > 0 ? modals[modals.length - 1] : document;

    const candidates = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );

    return candidates.filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
  }

  private moveDomFocus(delta: 1 | -1) {
    const focusables = this.getFocusableElements();
    if (focusables.length === 0) return;

    const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
    let nextIndex = 0;
    if (currentIndex === -1) {
      nextIndex = delta > 0 ? 0 : focusables.length - 1;
    } else {
      nextIndex = (currentIndex + delta + focusables.length) % focusables.length;
    }
    focusables[nextIndex].focus();
  }

  private activateFocusedElement() {
    const active = document.activeElement;
    if (active instanceof HTMLButtonElement && !active.disabled) {
      active.click();
      return;
    }
    if (active instanceof HTMLInputElement && active.type === 'range') {
      return;
    }
    // Otherwise click the first primary focusable button in the active modal/view
    const focusables = this.getFocusableElements();
    const firstBtn = focusables.find((el): el is HTMLButtonElement => el instanceof HTMLButtonElement);
    if (firstBtn) {
      firstBtn.focus();
      firstBtn.click();
    }
  }

  private triggerMenuNavigation(dir: 'up' | 'down' | 'left' | 'right') {
    const keyMap = {
      up: { key: 'ArrowUp', code: 'ArrowUp', delta: -1 as const },
      down: { key: 'ArrowDown', code: 'ArrowDown', delta: 1 as const },
      left: { key: 'ArrowLeft', code: 'ArrowLeft', delta: -1 as const },
      right: { key: 'ArrowRight', code: 'ArrowRight', delta: 1 as const },
    };
    const info = keyMap[dir];
    const prevented = this.dispatchSyntheticKey(info.key, info.code);
    if (!prevented) {
      // If active element is a range slider and dir is left/right, adjust its value
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement &&
        active.type === 'range' &&
        (dir === 'left' || dir === 'right')
      ) {
        const step = parseFloat(active.step || '0.05');
        const min = parseFloat(active.min || '0');
        const max = parseFloat(active.max || '1');
        const curr = parseFloat(active.value || '0');
        const next = Math.max(min, Math.min(max, curr + (dir === 'right' ? step : -step)));
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;
        nativeSetter?.call(active, String(next));
        active.dispatchEvent(new Event('input', { bubbles: true }));
        active.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }

      this.moveDomFocus(info.delta);
    }
  }

  private pollGamepad(dt: number) {
    const gp = this.findActiveGamepad();
    if (!gp) {
      if (this.gamepadStatus.connected) {
        this.gpLeft = false;
        this.gpRight = false;
        this.gpJump = false;
        this.syncCombined();
        this.notifyGamepadListeners({ connected: false, name: null });
      }
      return;
    }

    if (!this.gamepadStatus.connected) {
      this.notifyGamepadListeners({
        connected: true,
        name: this.formatGamepadName(gp.id),
      });
    }

    const axisX = gp.axes[0] ?? 0;
    const axisY = gp.axes[1] ?? 0;

    const dpadUp = gp.buttons[12]?.pressed ?? false;
    const dpadDown = gp.buttons[13]?.pressed ?? false;
    const dpadLeft = gp.buttons[14]?.pressed ?? false;
    const dpadRight = gp.buttons[15]?.pressed ?? false;

    const btnA = gp.buttons[0]?.pressed ?? false; // Cross / A
    const btnB = gp.buttons[1]?.pressed ?? false; // Circle / B
    const btnX = gp.buttons[2]?.pressed ?? false; // Square / X (Kotak)
    const btnRB = gp.buttons[5]?.pressed ?? false; // R1 / RB
    const btnStart = gp.buttons[9]?.pressed ?? false;

    const aJustPressed = btnA && !this.prevBtnA;
    const bJustPressed = btnB && !this.prevBtnB;
    const startJustPressed = btnStart && !this.prevBtnStart;
    const restartNow = btnRB;
    const restartJustPressed = restartNow && !this.prevBtnRestart;

    this.prevBtnA = btnA;
    this.prevBtnB = btnB;
    this.prevBtnStart = btnStart;
    this.prevBtnRestart = restartNow;

    if (this.menuMode) {
      // Clear gameplay movement flags while in menus/modals
      if (this.gpLeft || this.gpRight || this.gpJump) {
        this.gpLeft = false;
        this.gpRight = false;
        this.gpJump = false;
        this.syncCombined();
      }
      this.prevGpJump = false;

      // Determine discrete menu direction
      let dir: 'up' | 'down' | 'left' | 'right' | null = null;
      if (dpadUp || axisY < -0.55) dir = 'up';
      else if (dpadDown || axisY > 0.55) dir = 'down';
      else if (dpadLeft || axisX < -0.55) dir = 'left';
      else if (dpadRight || axisX > 0.55) dir = 'right';

      if (dir !== this.activeMenuDir) {
        this.activeMenuDir = dir;
        this.menuDirHoldTimer = 0;
        this.menuDirRepeatTimer = 0;
        if (dir) {
          this.triggerMenuNavigation(dir);
        }
      } else if (dir) {
        this.menuDirHoldTimer += dt;
        if (this.menuDirHoldTimer >= 0.34) {
          this.menuDirRepeatTimer += dt;
          if (this.menuDirRepeatTimer >= 0.14) {
            this.menuDirRepeatTimer = 0;
            this.triggerMenuNavigation(dir);
          }
        }
      }

      if (aJustPressed) {
        const prevented = this.dispatchSyntheticKey('Enter', 'Enter');
        if (!prevented) {
          this.activateFocusedElement();
        }
      }

      if (bJustPressed || startJustPressed) {
        this.dispatchSyntheticKey('Escape', 'Escape');
      }
      return;
    }

    // Active Gameplay Mode
    this.activeMenuDir = null;

    // Horizontal movement ONLY (Left Analog stick X with 0.25 deadzone + D-Pad Left/Right)
    this.gpLeft = dpadLeft || axisX < -0.25;
    this.gpRight = dpadRight || axisX > 0.25;

    // Jump using Kotak (Square / X - buttons[2]); left stick up/down does not jump
    const jumpNow = btnX;
    if (jumpNow && !this.prevGpJump) {
      this.jumpJustPressed = true;
      this.jumpBufferTimer = 0.2;
    } else if (!jumpNow && this.prevGpJump) {
      if (!this.kbJump && !this.touchJump) {
        this.jumpJustPressed = false;
      }
    }
    this.gpJump = jumpNow;
    this.prevGpJump = jumpNow;

    this.syncCombined();

    // Pause with Start / Options
    if (startJustPressed) {
      this.dispatchSyntheticKey('Escape', 'Escape');
    }

    // Quick Restart with R1 / RB
    if (restartJustPressed) {
      this.resetPressed = true;
      this.dispatchSyntheticKey('r', 'KeyR');
    }
  }

  public setLeft(pressed: boolean) {
    this.touchLeft = pressed;
    this.syncCombined();
  }

  public setRight(pressed: boolean) {
    this.touchRight = pressed;
    this.syncCombined();
  }

  public setJump(pressed: boolean) {
    if (pressed && !this.touchJump && !this.jump) {
      this.jumpJustPressed = true;
      this.jumpBufferTimer = 0.2;
    }
    if (!pressed && !this.kbJump && !this.gpJump) {
      this.jumpJustPressed = false;
    }
    this.touchJump = pressed;
    this.syncCombined();
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
    this.kbLeft = false;
    this.kbRight = false;
    this.kbJump = false;
    this.touchLeft = false;
    this.touchRight = false;
    this.touchJump = false;
    this.gpLeft = false;
    this.gpRight = false;
    this.gpJump = false;
    this.prevGpJump = false;
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
