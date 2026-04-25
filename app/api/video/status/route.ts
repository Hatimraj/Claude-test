import { prisma } from "@/lib/db";
import { getVideoTaskStatus } from "@/lib/kie/client";
import { z } from "zod";

const schema = z.object({
  videoGenerationId: z.string()
});

export async function POST(request: Request) {
  try {
    const { videoGenerationId } = schema.parse(await request.json());

    const videoGeneration = await prisma.videoGeneration.findUnique({ where: { id: videoGenerationId } });
    if (!videoGeneration) {
      return Response.json({ error: "Video generation not found" }, { status: 404 });
    }

    const task = await getVideoTaskStatus(videoGeneration.providerId, videoGeneration.taskId);

    const updated = await prisma.videoGeneration.update({
      where: { id: videoGenerationId },
      data: {
        status: task.status,
        videoUrls: task.resultUrls ? JSON.parse(JSON.stringify(task.resultUrls)) : videoGeneration.videoUrls,
        rawResponse: JSON.parse(JSON.stringify(task.raw))
      }
    });

    return Response.json({
      videoGenerationId: updated.id,
      status: updated.status,
      videoUrls: updated.videoUrls ?? []
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
