// Auto-generated from "Tars python v1" (LEGO Robot Inventor python-mode project).
// Source: .lms -> projectbody.json ("main"/"program" field), transpiled from MicroPython.
// Best-effort transpile: hub/utime/random are simulated stubs (see hubRuntime.ts), and this
// module runs its top-level control loop immediately on import, exactly like the original
// program does when flashed to a hub. Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import {
  createHub,
  createUtime,
  randrange,
  pyMod,
  pyHasAttr,
  zipArrays,
  pyRange,
  PyProgramExit,
} from "../../lib/lms/hubRuntime";

const hub = createHub();
const utime = createUtime();

let left_arm, right_arm, left_shoulder, right_shoulder, ARM_FWD, ARM_BWD, ARM_DOWN, ARM_FAR_FWD, SHOULDERS_UP, SHOULDERS_DOWN, BODY_FWD_SWING_TIME, BODY_LAND_MOMENT, ARMS_FWD_TIME, PERIOD, ARM_ANIMATION, SHOULDER_ANIMATION, motors, functions, start_functions, tars_walk, timer;
left_arm = hub.port.B.motor;
right_arm = hub.port.A.motor;
left_shoulder = hub.port.E.motor;
right_shoulder = hub.port.F.motor;
ARM_FWD = 15;
ARM_BWD = (-38);
ARM_DOWN = 0;
ARM_FAR_FWD = 45;
SHOULDERS_UP = 0;
SHOULDERS_DOWN = (-180);
BODY_FWD_SWING_TIME = 120;
BODY_LAND_MOMENT = (BODY_FWD_SWING_TIME + 250);
ARMS_FWD_TIME = 200;
PERIOD = ((BODY_LAND_MOMENT + ARMS_FWD_TIME) + 2000);
ARM_ANIMATION = [[(-500), ARM_FWD], [(-20), (ARM_FWD + 18)], [BODY_FWD_SWING_TIME, ARM_BWD], [BODY_LAND_MOMENT, ARM_BWD], [(BODY_LAND_MOMENT + ARMS_FWD_TIME), ARM_DOWN], [((BODY_LAND_MOMENT + ARMS_FWD_TIME) + 150), ARM_FAR_FWD], [((BODY_LAND_MOMENT + ARMS_FWD_TIME) + 1000), ARM_FAR_FWD], [(PERIOD - 800), 10], [PERIOD, ARM_FWD]];
SHOULDER_ANIMATION = [[(-500), SHOULDERS_DOWN], [0, SHOULDERS_DOWN], [BODY_LAND_MOMENT, SHOULDERS_DOWN], [(BODY_LAND_MOMENT + ARMS_FWD_TIME), SHOULDERS_UP], [(PERIOD - 800), SHOULDERS_UP], [PERIOD, SHOULDERS_DOWN]];
class Mechanism {
  motors: any;
  motor_functions: any;
  constructor(motors: any, motor_functions: any, reset_motors: any = true) {
    let absolute_position;
    this.motors = motors;
    this.motor_functions = motor_functions;
    if (reset_motors) {
      for (const motor of motors) {
        absolute_position = motor.get().at(2);
        if ((absolute_position > 180)) {
          absolute_position -= 360;
        }
        motor.preset(absolute_position);
      }
    }
  }
  static float_to_motorpower(f: any) {
    return Math.min(Math.max(Math.trunc(f), (-100)), 100);
  }
  update_motor_pwms(ticks: any) {
    let target_position, current_position;
    for (const [motor, motor_function] of zipArrays(this.motors, this.motor_functions)) {
      target_position = motor_function(ticks);
      current_position = motor.get().at(1);
      motor.pwm(Mechanism.float_to_motorpower(((target_position - current_position) * 2)));
    }
  }
  stop() {
    for (const motor of this.motors) {
      motor.pwm(0);
    }
  }
}
function linear_interpolation(points: any, wrapping: any = true, scale: any = 1) {
  let x_min, x_max, x_range;
  points.sort((a, b) => (((point) => point.at(0)))(a) - (((point) => point.at(0)))(b));
  x_min = points.at(0).at(0);
  x_max = points.at((-1)).at(0);
  x_range = (x_max - x_min);
  points = points.map(([x, y]) => [(x - x_min), (scale * y)]);
  function function_(x: any) {
    let x1, y1, x2, y2;
    x -= x_min;
    if ((!wrapping)) {
      if ((x <= points.at(0).at(0))) {
        return points.at(0).at(1);
      } else if ((x >= points.at((-1)).at(0))) {
        return points.at((-1)).at(1);
      }
    } else {
      x = pyMod(x, x_range);
    }
    for (let i = 0; i < points.length; i++) {
      if ((x < points.at(i).at(0))) {
        [x1, y1] = points.at((i - 1));
        [x2, y2] = points.at(i);
        return (y1 + (((x - x1) / (x2 - x1)) * (y2 - y1)));
      }
    }
  }
  return function_;
}
class AMHTimer {
  running: any;
  pause_time: any;
  reset_at_next_start: any;
  __speed_factor: any;
  __accel_factor: any;
  start_time: any;
  constructor(rate: any = 1000, acceleration: any = 0) {
    this.running = true;
    this.pause_time = 0;
    this.reset_at_next_start = false;
    this.__speed_factor = (rate / 1000);
    this.__accel_factor = (acceleration / 1000000);
    this.start_time = utime.ticks_ms();
  }
  get time() {
    let elapsed;
    if (this.running) {
      elapsed = utime.ticks_diff(utime.ticks_ms(), this.start_time);
      return Math.trunc((((this.__accel_factor * (elapsed ** 2)) + (this.__speed_factor * elapsed)) + this.pause_time));
    } else {
      return this.pause_time;
    }
  }
  set time(setting: any) {
    this.pause_time = setting;
    this.start_time = utime.ticks_ms();
  }
  pause() {
    if (this.running) {
      this.pause_time = this.time;
      this.running = false;
    }
  }
  stop() {
    this.pause();
  }
  start() {
    if ((!this.running)) {
      this.start_time = utime.ticks_ms();
      this.running = true;
    }
  }
  resume() {
    this.start();
  }
  reset() {
    this.time = 0;
  }
  reverse() {
    this.rate *= (-1);
  }
  get rate() {
    let elapsed;
    elapsed = utime.ticks_diff(utime.ticks_ms(), this.start_time);
    return (((this.__accel_factor * elapsed) + this.__speed_factor) * 1000);
  }
  set rate(setting: any) {
    if ((this.__speed_factor !== (setting / 1000))) {
      if (this.running) {
        this.pause();
      }
      this.__speed_factor = (setting / 1000);
      this.start();
    }
  }
  get acceleration() {
    return (this.__accel_factor * 1000000);
  }
  set acceleration(setting: any) {
    if ((this.__accel_factor !== (setting / 1000000))) {
      if (this.running) {
        this.pause();
      }
      this.__speed_factor = (this.rate / 1000);
      this.__accel_factor = (setting / 1000000);
      this.start();
    }
  }
}
motors = [left_arm, right_arm, left_shoulder, right_shoulder];
functions = [linear_interpolation(ARM_ANIMATION), linear_interpolation(ARM_ANIMATION, true, (-1)), linear_interpolation(SHOULDER_ANIMATION), linear_interpolation(SHOULDER_ANIMATION, true, (-1))];
start_functions = [((x) => (-20)), ((x) => (-20)), ((x) => SHOULDERS_DOWN), ((x) => (-SHOULDERS_DOWN))];
tars_walk = new Mechanism(motors, functions);
timer = new AMHTimer();
while ((timer.time < (8 * (PERIOD + 500)))) {
  tars_walk.update_motor_pwms(timer.time);
}
tars_walk.stop();
throw new PyProgramExit();
