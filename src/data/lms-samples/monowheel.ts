// Auto-generated from "Monowheel" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "6UxIMiik9HZe-Uvf43Fq".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  const vars: Record<string, any> = {
    rotate_power: 0,
  };
  robot.events.onProgramStart(async () => {
    while (true) {
      await robot.motor.startPower("B", (robot.input.gamepadButtonPressure(7) - robot.input.gamepadButtonPressure(6)));
      await robot.motor.startPower("E", ((robot.input.gamepadButtonPressure(7) - robot.input.gamepadButtonPressure(6)) * -1));
    }
  });
  robot.events.onXboxJoystick(0, "right", async () => {
    vars.rotate_power = 100;
    await robot.events.broadcast("rotate");
  });
  robot.events.onBroadcastReceived("rotate", async () => {
    await robot.motor.startPower("CD", vars.rotate_power);
    await robot.control.wait(0.1 * 1000);
    await robot.motor.stop("DC");
  });
  robot.events.onXboxJoystick(0, "left", async () => {
    vars.rotate_power = -100;
    await robot.events.broadcast("rotate");
  });
}
