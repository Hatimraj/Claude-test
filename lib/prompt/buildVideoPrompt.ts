import { VideoTaskParams } from "@/lib/kie/types";

const cameraInstructions: Record<VideoTaskParams["cameraMovement"], string> = {
  "pov-handheld":
    "Animate the selected image into an ultra realistic POV handheld video, as if a normal person is proudly filming their finished food creation with a phone camera. Natural human micro-shakes, subtle handheld zoom, small angle changes, no scene cuts, no platter replacement.",
  "slow-push-in": "Slow cinematic push-in movement while preserving every ingredient and board detail.",
  orbit: "Subtle orbit camera move around the board while preserving exact composition and placement.",
  "plate-rotation-with-hands":
    "Two realistic human hands gently touch the edges of the board and slowly rotate it in place by 15–25 degrees without lifting it. The board stays fully in contact with the table. Subtle friction sound. Tiny natural micro-shifts only.",
  "macro-pull-back": "Start close in macro and pull back slowly to reveal the full board without changing composition."
};

const audioInstructions: Record<VideoTaskParams["audioMode"], string> = {
  "natural-sounds": "Audio: no music, natural ambient food styling sounds only.",
  "soft-instrumental": "Audio: soft instrumental soundtrack with low mix.",
  silent: "Audio: silent output."
};

export const buildVideoPrompt = ({
  prompt,
  duration,
  cameraMovement,
  audioMode
}: Pick<VideoTaskParams, "prompt" | "duration" | "cameraMovement" | "audioMode">) => {
  return [
    prompt,
    "ABSOLUTE REFERENCE LOCK:",
    "Use the selected image as the exact subject reference.",
    "Keep the same exact board, same food arrangement, same ingredients, same colors, same background, same table, same style from start to finish.",
    "Do not redesign, replace, regenerate, simplify, or transform the original creation.",
    "No ingredients may appear, disappear, or change position noticeably.",
    cameraInstructions[cameraMovement],
    `${duration}s duration.`,
    audioInstructions[audioMode]
  ].join("\n");
};
