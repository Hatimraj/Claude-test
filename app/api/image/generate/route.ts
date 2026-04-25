import { prisma } from "@/lib/db";
import { createImageTask } from "@/lib/kie/client";
import { z } from "zod";

const schema = z.object({
  projectId: z.string().optional(),
  title: z.string().default("Untitled Food Art Project"),
  niche: z.string().default("food-art"),
  basePrompt: z.string().default(""),
  providerId: z.string(),
  prompt: z.string().min(10),
  negativePrompt: z.string().optional(),
  aspectRatio: z.enum(["1:1", "4:5", "9:16", "16:9"]),
  outputFormat: z.enum(["png", "jpeg", "webp"]).default("png"),
  n: z.number().int().min(1).max(4).default(1)
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());

    const project = payload.projectId
      ? await prisma.project.findUnique({ where: { id: payload.projectId } })
      : await prisma.project.create({
          data: {
            title: payload.title,
            niche: payload.niche,
            basePrompt: payload.basePrompt || payload.prompt
          }
        });

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const task = await createImageTask(payload.providerId, {
      prompt: payload.prompt,
      negativePrompt: payload.negativePrompt,
      aspectRatio: payload.aspectRatio,
      outputFormat: payload.outputFormat,
      n: payload.n
    });

    const generation = await prisma.imageGeneration.create({
      data: {
        projectId: project.id,
        providerId: payload.providerId,
        prompt: payload.prompt,
        status: task.status,
        taskId: task.taskId,
        imageUrls: task.resultUrls ? JSON.parse(JSON.stringify(task.resultUrls)) : null,
        rawResponse: JSON.parse(JSON.stringify(task.raw))
      }
    });

    return Response.json({
      projectId: project.id,
      generationId: generation.id,
      taskId: task.taskId,
      status: task.status
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
