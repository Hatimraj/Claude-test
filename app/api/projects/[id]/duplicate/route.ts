import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  const clone = await prisma.project.create({
    data: {
      title: `${project.title} (copy)`,
      niche: project.niche,
      basePrompt: project.basePrompt
    }
  });

  return Response.json({ projectId: clone.id });
}
