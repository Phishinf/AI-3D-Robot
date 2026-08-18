// Auto-generated from "Caterpillar" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "Jc0rEWEhmR0XpL6q3_VY".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  const vars: Record<string, any> = {
    power_left: 0,
    power_right: 0,
    steer: 0,
  };
  robot.events.onProgramStart(async () => {
    while (true) {
      if (isInBetween(robot.input.gamepadAxis(0, 0), -30, 30)) {
        vars.steer = 0;
      } else {
        vars.steer = robot.input.gamepadAxis(0, 0);
      }
      vars.power_left = ((robot.input.gamepadButtonPressure(7) - robot.input.gamepadButtonPressure(6)) - (vars.steer * -1));
      vars.power_right = ((robot.input.gamepadButtonPressure(7) - robot.input.gamepadButtonPressure(6)) - (vars.steer * 1));
      await robot.motor.startPower("A", vars.power_left);
      await robot.motor.startPower("E", (vars.power_right * -1));
    }
  });
  robot.events.onProgramStart(async () => {
    while (true) {
      await robot.control.waitUntil(() => robot.input.xboxButtonPressed(0));
      await robot.motor.goToPosition("C", 50, "shortest");
      await robot.motor.goToPosition("C", 0, "shortest");
      await robot.control.waitUntil(() => robot.input.xboxButtonPressed(0));
      await robot.motor.goToPosition("C", 310, "shortest");
      await robot.motor.goToPosition("C", 0, "shortest");
    }
  });
  robot.events.onProgramStart(async () => {
    while (true) {
      if ((robot.input.xboxDpadPressed(14) || robot.input.xboxDpadPressed(15))) {
        if (robot.input.xboxDpadPressed(14)) {
          await robot.motor.startPower("D", -30);
        } else {
          await robot.motor.startPower("D", 30);
        }
      } else {
        await robot.motor.stop("D");
      }
    }
  });
}
