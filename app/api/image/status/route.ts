import { prisma } from "@/lib/db";
import { getImageTaskStatus } from "@/lib/kie/client";
import { z } from "zod";

const schema = z.object({
  generationId: z.string()
});

export async function POST(request: Request) {
  try {
    const { generationId } = schema.parse(await request.json());

    const generation = await prisma.imageGeneration.findUnique({ where: { id: generationId } });
    if (!generation) {
      return Response.json({ error: "Image generation not found" }, { status: 404 });
    }

    const task = await getImageTaskStatus(generation.providerId, generation.taskId);

    const updated = await prisma.imageGeneration.update({
      where: { id: generation.id },
      data: {
        status: task.status,
        imageUrls: task.resultUrls ? JSON.parse(JSON.stringify(task.resultUrls)) : generation.imageUrls,
        rawResponse: JSON.parse(JSON.stringify(task.raw))
      }
    });

    return Response.json({
      generationId: updated.id,
      status: updated.status,
      imageUrls: updated.imageUrls ?? []
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
