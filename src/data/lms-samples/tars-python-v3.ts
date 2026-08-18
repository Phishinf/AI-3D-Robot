// Auto-generated from "Tars python v3" (LEGO Robot Inventor python-mode project).
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

let left_arm, right_arm, left_shoulder, right_shoulder, motors, ARM_FWD, ARM_BWD, ARM_FAR_FWD, SHOULDERS_UP, SHOULDERS_DOWN_FRONT, SHOULDERS_DOWN_BACK, START, BACKSWING, BODY_FWD_SWING_TIME, BODY_LAND_MOMENT, BODY_STAND_MOMENT, ARMS_PUSH_MOMENT, ARMS_FWD_MOMENT, LOOP_TIME, ARM_ANIMATION, SHOULDER_ANIMATION, functions, codelines_frames, animation, tars_walk, timer;
function* codelines() {
  let display, current_line, line_length, delete_a_line;
  /**
   * Generator for Tars-style codelines, as seen in insterstellar
   * usage:
   * mycodelines = codelines()
   * image_matrix = next(mycodelines)
   */
  display = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
  yield display;
  current_line = 0;
  while (true) {
    while ((current_line < 5)) {
      line_length = randrange(6);
      for (let column = 0; column < line_length; column++) {
        display.at(current_line)[column] = 6;
        yield display;
        display.at(current_line)[column] = 9;
        yield display;
      }
      if ((line_length < 5)) {
        for (let n = 0; n < 6; n++) {
          display.at(current_line)[line_length] = 9;
          yield display;
          display.at(current_line)[line_length] = 0;
          yield display;
        }
      }
      current_line += 1;
    }
    delete_a_line = 1;
    while (delete_a_line) {
      display.shift();
      display.push([0, 0, 0, 0, 0]);
      if ((current_line > 0)) {
        current_line -= 1;
      }
      yield display;
      delete_a_line = randrange(2);
    }
  }
}
class AMHAnimation {
  frames: any;
  interval: any;
  start_time: any;
  next_frame_time: any;
  current_frame: any;
  constructor(frames: any, fps: any = 12) {
    this.frames = frames;
    this.interval = Math.trunc((1000 / fps));
    this.start_time = utime.ticks_ms();
    this.next_frame_time = 0;
    this.current_frame = 0;
  }
  update_display(time: any = null) {
    let image;
    if ((!time)) {
      time = utime.ticks_diff(utime.ticks_ms(), this.start_time);
    }
    if ((time >= this.next_frame_time)) {
      image = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
      if (pyHasAttr(this.frames, "__next__")) {
        image = this.frames.next().value;
        this.next_frame_time += this.interval;
      } else {
        if ((this.frames.at(0).length > 2)) {
          image = this.frames.at(this.current_frame);
          this.next_frame_time += this.interval;
        } else {
          image = this.frames.at(this.current_frame).at(1);
          this.next_frame_time += this.frames.at(this.current_frame).at(0);
        }
        this.current_frame += 1;
        if ((this.current_frame >= this.frames.length)) {
          this.current_frame = 0;
        }
      }
      hub.display.show(hub.Image(image.map((r) => r.map((n) => String(n)).join("")).join(":")));
    }
  }
}
class Mechanism {
  motors: any;
  motor_functions: any;
  ramp_pwm: any;
  Kp: any;
  constructor(motors: any, motor_functions: any, reset_zero: any = true, ramp_pwm: any = 100, Kp: any = 1.2) {
    this.motors = motors.map((m) => (pyHasAttr(m, "_motor_wrapper") ? m._motor_wrapper.motor : m));
    this.motor_functions = motor_functions;
    this.ramp_pwm = ramp_pwm;
    this.Kp = Kp;
    if (reset_zero) {
      this.relative_position_reset();
    }
  }
  relative_position_reset() {
    let absolute_position;
    for (const motor of this.motors) {
      absolute_position = motor.get().at(2);
      if ((absolute_position > 180)) {
        absolute_position -= 360;
      }
      motor.preset(absolute_position);
    }
  }
  static float_to_motorpower(f: any) {
    return Math.min(Math.max(Math.trunc(f), (-100)), 100);
  }
  update_motor_pwms(ticks: any) {
    let target_position, current_position, power, max_power;
    for (const [motor, motor_function] of zipArrays(this.motors, this.motor_functions)) {
      target_position = motor_function(ticks);
      current_position = motor.get().at(1);
      power = Mechanism.float_to_motorpower(((target_position - current_position) * this.Kp));
      if ((this.ramp_pwm < 100)) {
        max_power = Math.trunc((this.ramp_pwm * Math.abs(ticks)));
        if ((power < 0)) {
          power = Math.max(power, (-max_power));
        } else {
          power = Math.min(power, max_power);
        }
      }
      motor.pwm(power);
    }
  }
  shortest_path_reset(ticks: any = 0, speed: any = 20) {
    let target_position, current_position, pwms;
    this.relative_position_reset();
    for (const [motor, motor_function] of zipArrays(this.motors, this.motor_functions)) {
      target_position = Math.trunc(motor_function(ticks));
      current_position = motor.get().at(1);
      if (((target_position - current_position) > 180)) {
        motor.preset((current_position + 360));
      }
      if (((target_position - current_position) < (-180))) {
        motor.preset((current_position - 360));
      }
      motor.run_to_position(target_position, speed);
    }
    utime.sleep_ms(50);
    while (true) {
      pwms = [];
      for (const motor of this.motors) {
        pwms.push(motor.get().at(3));
      }
      if ((!pwms.some(Boolean))) {
        break;
      }
    }
  }
  stop() {
    for (const motor of this.motors) {
      motor.pwm(0);
    }
  }
}
function linear_interpolation(points: any, wrapping: any = true, scale: any = 1, accumulation_per_period: any = 0, time_offset: any = 0) {
  let x_min, x_max, x_range;
  /**
   * Returns a method that interpolates values between keyframes / key coordinates.
   * 
   * Input: list of coordinates
   * Returns: A method(!) that interpolates a value between given points
   * 
   * Arguments:
   * - scale_y: scale the y coordinates to enlarge movements or to invert them (scale_y=-1)
   * - wrapping: True by default. If an x value is beyond the highest x value in the point list,
   * wrapping will wrap the values and look back to the first coordinates.
   * 
   * Example:
   * my_function = linear_interpolation([(0,0), (1000,360), (2000,0)])
   * my_function(500)# returns 180.
   * my_function(2500) # Also returns 180, because of wrapping.
   */
  points.sort((a, b) => (((point) => point.at(0)))(a) - (((point) => point.at(0)))(b));
  x_min = points.at(0).at(0);
  x_max = points.at((-1)).at(0);
  x_range = (x_max - x_min);
  points = points.map(([x, y]) => [(x - x_min), (scale * y)]);
  function function_(x: any) {
    let x_phase, x_periods, x1, y1, x2, y2, interpolated_y;
    x -= (x_min + time_offset);
    if ((!wrapping)) {
      if ((x <= points.at(0).at(0))) {
        return points.at(0).at(1);
      } else if ((x >= points.at((-1)).at(0))) {
        return points.at((-1)).at(1);
      }
    } else {
      x_phase = pyMod(x, x_range);
      x_periods = Math.floor(x / x_range);
    }
    for (let i = 0; i < points.length; i++) {
      if ((x_phase < points.at(i).at(0))) {
        [x1, y1] = points.at((i - 1));
        [x2, y2] = points.at(i);
        interpolated_y = (y1 + (((x_phase - x1) / (x2 - x1)) * (y2 - y1)));
        return ((x_periods * accumulation_per_period) + interpolated_y);
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
left_arm = hub.port.B.motor;
right_arm = hub.port.A.motor;
left_shoulder = hub.port.E.motor;
right_shoulder = hub.port.F.motor;
motors = [left_arm, right_arm, left_shoulder, right_shoulder];
ARM_FWD = 20;
ARM_BWD = (-40);
ARM_FAR_FWD = 45;
SHOULDERS_UP = 0;
SHOULDERS_DOWN_FRONT = 180;
SHOULDERS_DOWN_BACK = (-180);
START = 0;
BACKSWING = 500;
BODY_FWD_SWING_TIME = (BACKSWING + 150);
BODY_LAND_MOMENT = (BODY_FWD_SWING_TIME + 500);
BODY_STAND_MOMENT = (BODY_LAND_MOMENT + 250);
ARMS_PUSH_MOMENT = (BODY_STAND_MOMENT + 800);
ARMS_FWD_MOMENT = (ARMS_PUSH_MOMENT + 300);
LOOP_TIME = (ARMS_FWD_MOMENT + 600);
ARM_ANIMATION = [[START, ARM_FWD], [BACKSWING, ARM_FAR_FWD], [BODY_FWD_SWING_TIME, ARM_BWD], [BODY_STAND_MOMENT, ARM_BWD], [(ARMS_FWD_MOMENT + 200), ARM_FWD], [LOOP_TIME, ARM_FWD]];
SHOULDER_ANIMATION = [[START, 120], [BACKSWING, SHOULDERS_DOWN_FRONT], [BODY_FWD_SWING_TIME, SHOULDERS_DOWN_FRONT], [BODY_LAND_MOMENT, SHOULDERS_UP], [ARMS_PUSH_MOMENT, SHOULDERS_DOWN_BACK], [ARMS_FWD_MOMENT, SHOULDERS_UP], [LOOP_TIME, 120]];
functions = [linear_interpolation(ARM_ANIMATION), linear_interpolation(ARM_ANIMATION, true, (-1), 0, 0), linear_interpolation(SHOULDER_ANIMATION), linear_interpolation(SHOULDER_ANIMATION, true, (-1), 0, 0)];
codelines_frames = codelines();
animation = new AMHAnimation(codelines_frames);
tars_walk = new Mechanism(motors, functions);
tars_walk.shortest_path_reset();
timer = new AMHTimer();
timer.rate = 300;
while ((timer.time < (10 * LOOP_TIME))) {
  tars_walk.update_motor_pwms(timer.time);
  animation.update_display();
}
tars_walk.stop();
throw new PyProgramExit();
