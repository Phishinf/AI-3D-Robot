// Auto-generated from "Gelo 1" (LEGO Robot Inventor word-blocks project).
// Source: .lms -> scratch.sb3 -> project.json, target "RPMbxsiTBugxQiBrxkN-".
// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.
import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";

export function registerProgram(robot: RobotInventorRuntime): void {
  robot.events.onProgramStart(async () => {
    await robot.display.ultrasonicLightUp("E", "100 100 100 100");
    await robot.display.ledRotateOrientation(3);
    await robot.display.ledAnimation({"animationName":"Pulse","fps":2,"loop":true,"frames":[{"pixels":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0]},{"pixels":[0,0,0,0,0,0,0,0,0,0,1,0.8888888888888888,0.7777777777777778,0.6666666666666667,0.5555555555555556,0,0,0,0,0,0,0,0,0,0]}],"transition":4});
    await robot.sound.playUntilDone("Initialize");
    await robot.modelSpecific.dogBotSetSpeed(75);
    await robot.modelSpecific.dogBotWalkForSeconds("forward", 3);
  });
}
