/**
 * Typed runtime surface that generated LEGO MINDSTORMS / Robot Inventor
 * ("Flipper" hub) programs are compiled against.
 *
 * This mirrors the block palette exposed by the "flipper*" Scratch
 * extensions (flippermotor, flippermove, flipperdisplay, flippersound,
 * flippermodelspecific, flippervirtualremote, flipperxboxgamepad) found in
 * the .lms project files in this repo. It is intentionally shaped like the
 * `RoboticsProvider` adapter described in architecture.md Section 3.3/6 —
 * a real hardware bridge (BLE/serial to the hub) can implement the same
 * interface without touching generated program code.
 */

export type MotorPort = "A" | "B" | "C" | "D" | "E" | "F";
/** A single port letter or a combined pair, e.g. "AB", "CE". */
export type PortRef = string;

export type RotationDirection = "clockwise" | "counterclockwise" | "shortest";
export type MoveDirection = "forward" | "backward" | "left" | "right";
export type AngleUnit = "rotations" | "degrees" | "seconds" | "cm" | "inches";

export interface LedFrame {
  /** 5x5 grid, values 0-1 (brightness) per pixel, row-major. */
  pixels: number[];
}

export interface LedAnimation {
  animationName?: string;
  fps?: number;
  loop?: boolean;
  frames: LedFrame[];
  transition?: number;
}

export interface SoundRef {
  name: string;
  location?: string;
  path?: string;
}

/** In-between check used by the "is X between Y and Z" reporter block. */
export function isInBetween(value: number, low: number, high: number): boolean {
  return value >= low && value <= high;
}

export interface RobotInventorRuntime {
  events: {
    onProgramStart(handler: () => void | Promise<void>): void;
    onBroadcastReceived(message: string, handler: () => void | Promise<void>): void;
    broadcast(message: string): Promise<void>;
    onRemoteButton(
      buttonLabel: string,
      action: "pressed" | "released",
      handler: () => void | Promise<void>,
    ): void;
    onXboxJoystick(stick: number, option: string, handler: () => void | Promise<void>): void;
  };
  motor: {
    setSpeed(port: PortRef, percent: number): Promise<void>;
    startDirection(port: PortRef, direction: RotationDirection): Promise<void>;
    startPower(port: PortRef, power: number): Promise<void>;
    turnForDirection(
      port: PortRef,
      direction: RotationDirection,
      value: number,
      unit: AngleUnit,
    ): Promise<void>;
    goToPosition(port: PortRef, position: number, direction: RotationDirection): Promise<void>;
    stop(port: PortRef): Promise<void>;
  };
  move: {
    setPair(pair: PortRef): Promise<void>;
    setSpeed(percent: number): Promise<void>;
    move(direction: MoveDirection, value: number, unit: AngleUnit): Promise<void>;
    startSteer(steering: number): Promise<void>;
    steer(steering: number, value: number, unit: AngleUnit): Promise<void>;
  };
  display: {
    ledAnimation(animation: LedAnimation | string | number): Promise<void>;
    ledRotateOrientation(orientation: number): Promise<void>;
    ultrasonicLightUp(port: PortRef, pattern: string): Promise<void>;
  };
  sound: {
    playUntilDone(sound: SoundRef | string): Promise<void>;
  };
  control: {
    wait(ms: number): Promise<void>;
    waitUntil(condition: () => boolean): Promise<void>;
    stopProgram(): void;
  };
  modelSpecific: {
    dogBotSetSpeed(speed: number): Promise<void>;
    dogBotWalkForSeconds(direction: string, seconds: number): Promise<void>;
  };
  input: {
    xboxButtonPressed(button: number): boolean;
    xboxDpadPressed(button: number): boolean;
    gamepadAxis(stick: number, option: number): number;
    gamepadButtonPressure(button: number): number;
  };
}

class StopProgramSignal extends Error {}

/**
 * Console-driven simulator: no BLE/serial hardware required. Good enough to
 * read through a converted program's behavior, or to unit test generated
 * control flow. Swap in a real hardware adapter that implements the same
 * interface to drive an actual hub.
 */
export function createSimulatedRuntime(log: (line: string) => void = console.log): RobotInventorRuntime {
  const broadcastHandlers = new Map<string, Array<() => void | Promise<void>>>();

  const runSafely = async (handler: () => void | Promise<void>) => {
    try {
      await handler();
    } catch (err) {
      if (!(err instanceof StopProgramSignal)) throw err;
    }
  };

  return {
    events: {
      onProgramStart(handler) {
        // A real hub starts the program immediately on flash; mirror that
        // here instead of requiring a separate "run" call.
        void runSafely(handler);
      },
      onBroadcastReceived(message, handler) {
        const list = broadcastHandlers.get(message) ?? [];
        list.push(handler);
        broadcastHandlers.set(message, list);
      },
      async broadcast(message) {
        log(`broadcast "${message}"`);
        for (const handler of broadcastHandlers.get(message) ?? []) {
          await runSafely(handler);
        }
      },
      onRemoteButton(buttonLabel, action) {
        log(`registered remote button "${buttonLabel}" (${action}) — simulator does not drive input`);
      },
      onXboxJoystick(stick, option) {
        log(`registered xbox joystick stick=${stick} option=${option} — simulator does not drive input`);
      },
    },
    motor: {
      async setSpeed(port, percent) {
        log(`motor[${port}].setSpeed(${percent}%)`);
      },
      async startDirection(port, direction) {
        log(`motor[${port}].start(${direction})`);
      },
      async startPower(port, power) {
        log(`motor[${port}].startPower(${power})`);
      },
      async turnForDirection(port, direction, value, unit) {
        log(`motor[${port}].turn(${direction}, ${value} ${unit})`);
      },
      async goToPosition(port, position, direction) {
        log(`motor[${port}].goToPosition(${position}°, ${direction})`);
      },
      async stop(port) {
        log(`motor[${port}].stop()`);
      },
    },
    move: {
      async setPair(pair) {
        log(`move.setPair(${pair})`);
      },
      async setSpeed(percent) {
        log(`move.setSpeed(${percent}%)`);
      },
      async move(direction, value, unit) {
        log(`move(${direction}, ${value} ${unit})`);
      },
      async startSteer(steering) {
        log(`move.startSteer(${steering})`);
      },
      async steer(steering, value, unit) {
        log(`move.steer(${steering}, ${value} ${unit})`);
      },
    },
    display: {
      async ledAnimation(animation) {
        const label = typeof animation === "object" ? animation.animationName ?? "custom" : String(animation);
        log(`display.ledAnimation(${label})`);
      },
      async ledRotateOrientation(orientation) {
        log(`display.rotate(${orientation})`);
      },
      async ultrasonicLightUp(port, pattern) {
        log(`display[${port}].ultrasonicLightUp(${pattern})`);
      },
    },
    sound: {
      async playUntilDone(sound) {
        const label = typeof sound === "object" ? sound.name : sound;
        log(`sound.playUntilDone(${label})`);
      },
    },
    control: {
      async wait(ms) {
        log(`wait(${ms}ms)`);
      },
      async waitUntil(condition) {
        log("waitUntil(...)");
        while (!condition()) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      },
      stopProgram() {
        log("stopProgram()");
        throw new StopProgramSignal();
      },
    },
    modelSpecific: {
      async dogBotSetSpeed(speed) {
        log(`dogBot.setSpeed(${speed})`);
      },
      async dogBotWalkForSeconds(direction, seconds) {
        log(`dogBot.walk(${direction}, ${seconds}s)`);
      },
    },
    input: {
      xboxButtonPressed: () => false,
      xboxDpadPressed: () => false,
      gamepadAxis: () => 0,
      gamepadButtonPressure: () => 0,
    },
  };
}
