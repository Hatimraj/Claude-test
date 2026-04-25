import { prisma } from "@/lib/db";
import { createVideoTask } from "@/lib/kie/client";
import { z } from "zod";

const schema = z.object({
  projectId: z.string(),
  imageGenerationId: z.string(),
  providerId: z.string(),
  prompt: z.string().min(20),
  duration: z.union([z.literal(4), z.literal(8), z.literal(12)]),
  aspectRatio: z.enum(["1:1", "4:5", "9:16", "16:9"]),
  cameraMovement: z.enum(["pov-handheld", "slow-push-in", "orbit", "plate-rotation-with-hands", "macro-pull-back"]),
  audioMode: z.enum(["natural-sounds", "soft-instrumental", "silent"])
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());

    const imageGeneration = await prisma.imageGeneration.findUnique({ where: { id: payload.imageGenerationId } });
    if (!imageGeneration || imageGeneration.projectId !== payload.projectId) {
      return Response.json({ error: "Selected image generation not found" }, { status: 404 });
    }

    await prisma.imageGeneration.updateMany({
      where: { projectId: payload.projectId },
      data: { selected: false }
    });

    await prisma.imageGeneration.update({ where: { id: payload.imageGenerationId }, data: { selected: true } });

    const imageUrls = Array.isArray(imageGeneration.imageUrls) ? (imageGeneration.imageUrls as string[]) : [];
    if (imageUrls.length === 0) {
      return Response.json({ error: "No image URL available for selected generation" }, { status: 400 });
    }

    const task = await createVideoTask(payload.providerId, {
      prompt: payload.prompt,
      imageUrls,
      duration: payload.duration,
      aspectRatio: payload.aspectRatio,
      cameraMovement: payload.cameraMovement,
      audioMode: payload.audioMode
    });

    const video = await prisma.videoGeneration.create({
      data: {
        projectId: payload.projectId,
        imageGenerationId: payload.imageGenerationId,
        providerId: payload.providerId,
        prompt: payload.prompt,
        taskId: task.taskId,
        status: task.status,
        videoUrls: task.resultUrls ? JSON.parse(JSON.stringify(task.resultUrls)) : null,
        rawResponse: JSON.parse(JSON.stringify(task.raw))
      }
    });

    return Response.json({
      videoGenerationId: video.id,
      taskId: task.taskId,
      status: task.status
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
