// Auto-generated from "Tars blocks v3" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "JnLk_TcjezqVcgUdIqKX".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  robot.events.onProgramStart(async () => {
    await robot.display.ledAnimation({"animationName":"Tars 2","fps":8,"loop":true,"frames":[{"pixels":[0.6666666666666667,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,0.6666666666666667,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,0.6666666666666667,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0.6666666666666667,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0.6666666666666667,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0.6666666666666667,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]},{"pixels":[1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0]}],"transition":1});
    await robot.events.broadcast("arms fwb");
    await robot.control.wait(0.3 * 1000);
    await robot.motor.goToPosition("EF", 180, "shortest");
    await robot.move.setPair("EF");
    for (let i = 0; i < 7; i++) {
      await robot.events.broadcast("arms bid");
      await robot.control.wait(0.3 * 1000);
      await robot.events.broadcast("arms fwb");
      await robot.move.steer(0, 0.5, "rotations");
      await robot.move.steer(0, 0.5, "rotations");
    }
    robot.control.stopProgram();
    return;
  });
  robot.events.onBroadcastReceived("arms bid", async () => {
    await robot.motor.goToPosition("A", 23, "shortest");
  });
  robot.events.onBroadcastReceived("arms bid", async () => {
    await robot.motor.goToPosition("B", 338, "shortest");
  });
  robot.events.onBroadcastReceived("arms fwb", async () => {
    await robot.control.wait(0.3 * 1000);
    await robot.motor.goToPosition("A", 350, "shortest");
  });
  robot.events.onBroadcastReceived("arms fwb", async () => {
    await robot.control.wait(0.3 * 1000);
    await robot.motor.goToPosition("B", 10, "shortest");
  });
  robot.events.onBroadcastReceived("arms far back", async () => {
    await robot.motor.goToPosition("A", 40, "shortest");
  });
  robot.events.onBroadcastReceived("arms far back", async () => {
    await robot.motor.goToPosition("B", 320, "shortest");
  });
  robot.events.onBroadcastReceived("arms down", async () => {
    await robot.motor.goToPosition("A", 355, "shortest");
  });
  robot.events.onBroadcastReceived("arms down", async () => {
    await robot.motor.goToPosition("B", 5, "shortest");
  });
}
