// Auto-generated from "Remote Control Batman Bike" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "SgYR8tK71zu1vU3GH0Wy".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  robot.events.onProgramStart(async () => {
    await robot.motor.goToPosition("CE", 0, "shortest");
    await robot.motor.setSpeed("AC", 100);
    await robot.motor.setSpeed("E", 70);
  });
  robot.events.onRemoteButton("1", "pressed", async () => {
    await robot.move.move("forward", 10, "cm");
    await robot.motor.startDirection("CE", "clockwise");
  });
  robot.events.onRemoteButton("1", "released", async () => {
    await robot.motor.stop("C");
  });
  robot.events.onRemoteButton("2", "pressed", async () => {
    await robot.motor.turnForDirection("A", "clockwise", 1, "rotations");
  });
  robot.events.onRemoteButton("2", "released", async () => {
    await robot.motor.goToPosition("A", 0, "shortest");
  });
  robot.events.onRemoteButton("3", "pressed", async () => {
    await robot.motor.turnForDirection("A", "clockwise", 1, "rotations");
  });
  robot.events.onRemoteButton("3", "released", async () => {
    await robot.motor.goToPosition("A", 0, "shortest");
  });
  robot.events.onRemoteButton("4", "pressed", async () => {
    await robot.motor.goToPosition("E", 40, "shortest");
  });
  robot.events.onRemoteButton("4", "released", async () => {
    await robot.motor.goToPosition("E", 0, "shortest");
  });
  robot.events.onRemoteButton("5", "pressed", async () => {
    await robot.motor.goToPosition("E", 330, "shortest");
  });
  robot.events.onRemoteButton("5", "released", async () => {
    await robot.motor.goToPosition("E", 0, "shortest");
  });
}
