/**
 * Simulated stand-in for the MicroPython `hub`/`utime`/`random` modules
 * that LEGO Robot Inventor "python mode" programs run against on-device.
 *
 * Programs transpiled from that mode (see pythonEmit.ts) import from here
 * instead of the real firmware modules, so the generated TypeScript reads
 * and type-checks standalone. Swap in a real BLE/serial bridge that
 * implements the same shape to drive an actual hub.
 */

export class PyProgramExit extends Error {}

/** Python's `%` floors toward negative infinity; JS's does not. Match Python. */
export function pyMod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/** `name in dir(obj)` from the original Python — approximated as "does this property exist". */
export function pyHasAttr(obj: unknown, name: string): boolean {
  return obj != null && typeof (obj as Record<string, unknown>)[name] !== "undefined";
}

/**
 * `zip(a, b)` from Python, only ever consumed by a `for` loop here.
 * Deliberately untyped (rather than generic over the element types): the
 * transpiled call sites pass values already typed `any` from the source
 * class fields, and TS's generic inference over `any[]` arguments can
 * collapse the destructured tuple elements to `unknown`/`{}` instead of
 * `any` -- see the plain-`any` signature below for why.
 */
export function zipArrays(a: any[], b: any[]): Array<[any, any]> {
  const len = Math.min(a.length, b.length);
  const out: Array<[any, any]> = [];
  for (let i = 0; i < len; i++) out.push([a[i], b[i]]);
  return out;
}

export function pyRange(startOrStop: number, stop?: number): number[] {
  const start = stop === undefined ? 0 : startOrStop;
  const end = stop === undefined ? startOrStop : stop;
  const out: number[] = [];
  for (let i = start; i < end; i++) out.push(i);
  return out;
}

export interface HubMotor {
  /** Mirrors MicroPython's motor.get(): [speed, position, absolute_position, pwm, ...]. Simulated as zeros. */
  get(): number[];
  preset(position: number): void;
  pwm(power: number): void;
  run_to_position(position: number, speed: number): void;
}

function createSimulatedMotor(port: string, log: (line: string) => void): HubMotor {
  return {
    get: () => {
      log(`hub.port.${port}.motor.get()`);
      return [0, 0, 0, 0];
    },
    preset: (position) => log(`hub.port.${port}.motor.preset(${position})`),
    pwm: (power) => log(`hub.port.${port}.motor.pwm(${power})`),
    run_to_position: (position, speed) => log(`hub.port.${port}.motor.run_to_position(${position}, ${speed})`),
  };
}

export function createHub(log: (line: string) => void = console.log) {
  const ports = ["A", "B", "C", "D", "E", "F"] as const;
  const port = Object.fromEntries(ports.map((p) => [p, { motor: createSimulatedMotor(p, log) }])) as Record<
    (typeof ports)[number],
    { motor: HubMotor }
  >;

  return {
    port,
    Image: (matrix: string) => matrix,
    display: {
      show: (image: string) => log(`hub.display.show(${image})`),
    },
  };
}

export function createUtime(log: (line: string) => void = console.log) {
  let simulatedNow = 0;
  return {
    ticks_ms: () => {
      simulatedNow += 1;
      return simulatedNow;
    },
    ticks_diff: (a: number, b: number) => a - b,
    sleep_ms: (ms: number) => log(`utime.sleep_ms(${ms})`),
  };
}

export function randrange(n: number): number {
  return Math.floor(Math.random() * n);
}
