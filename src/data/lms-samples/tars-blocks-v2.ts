// Auto-generated from "Tars blocks v2" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "JnLk_TcjezqVcgUdIqKX".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  robot.events.onProgramStart(async () => {
    await robot.motor.goToPosition("EF", 0, "shortest");
    await robot.move.setPair("EF");
    await robot.move.steer(0, 0.5, "rotations");
    for (let i = 0; i < 8; i++) {
      await robot.events.broadcast("arms bid");
      await robot.control.wait(0.5 * 1000);
      await robot.move.steer(0, 0.5, "rotations");
      await robot.events.broadcast("arms fwb");
      await robot.move.steer(0, 0.5, "rotations");
      await robot.control.wait(0 * 1000);
    }
    robot.control.stopProgram();
    return;
  });
  robot.events.onBroadcastReceived("arms bid", async () => {
    await robot.motor.goToPosition("A", 25, "shortest");
  });
  robot.events.onBroadcastReceived("arms bid", async () => {
    await robot.motor.goToPosition("B", 335, "shortest");
  });
  robot.events.onBroadcastReceived("arms fwb", async () => {
    await robot.motor.goToPosition("A", 350, "shortest");
  });
  robot.events.onBroadcastReceived("arms fwb", async () => {
    await robot.motor.goToPosition("B", 10, "shortest");
  });
  robot.events.onBroadcastReceived("arms far back", async () => {
    await robot.motor.goToPosition("A", 40, "shortest");
  });
  robot.events.onBroadcastReceived("arms far back", async () => {
    await robot.motor.goToPosition("B", 320, "shortest");
  });
  robot.events.onBroadcastReceived("arms down", async () => {
    await robot.motor.goToPosition("A", 0, "shortest");
  });
  robot.events.onBroadcastReceived("arms down", async () => {
    await robot.motor.goToPosition("B", 0, "shortest");
  });
}
