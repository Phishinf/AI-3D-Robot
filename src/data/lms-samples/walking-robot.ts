// Auto-generated from "Walking Robot" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "X5ROkjo5ccCNbew7VWXq".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  robot.events.onProgramStart(async () => {
    await robot.display.ultrasonicLightUp("C", "100 100 100 100");
    await robot.motor.goToPosition("A", 270, "shortest");
    await robot.motor.goToPosition("B", 0, "shortest");
  });
  robot.events.onRemoteButton("B1", "pressed", async () => {
    await robot.motor.goToPosition("A", 270, "shortest");
    await robot.motor.goToPosition("B", 0, "shortest");
    await robot.move.setSpeed(40);
    await robot.move.startSteer(0);
  });
  robot.events.onRemoteButton("B2", "pressed", async () => {
    await robot.motor.goToPosition("A", 0, "shortest");
    await robot.motor.setSpeed("AB", 30);
    await robot.motor.startDirection("A", "clockwise");
    await robot.motor.startDirection("B", "counterclockwise");
  });
  robot.events.onRemoteButton("B3", "pressed", async () => {
    await robot.motor.setSpeed("AB", 75);
    await robot.motor.startDirection("B", "clockwise");
  });
  robot.events.onRemoteButton("B4", "pressed", async () => {
    await robot.motor.setSpeed("AB", 75);
    await robot.motor.startDirection("A", "counterclockwise");
  });
  robot.events.onRemoteButton("B1", "released", async () => {
    await robot.motor.goToPosition("A", 270, "shortest");
    await robot.motor.goToPosition("B", 0, "shortest");
  });
  robot.events.onRemoteButton("B2", "pressed", async () => {
    await robot.motor.goToPosition("A", 270, "shortest");
    await robot.motor.turnForDirection("B", "clockwise", 1, "rotations");
  });
  robot.events.onRemoteButton("B3", "pressed", async () => {
    await robot.motor.goToPosition("A", 270, "shortest");
    await robot.motor.goToPosition("B", 0, "shortest");
  });
  robot.events.onRemoteButton("B4", "pressed", async () => {
    await robot.motor.goToPosition("A", 270, "shortest");
    await robot.motor.goToPosition("B", 0, "shortest");
  });
}
