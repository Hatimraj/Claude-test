import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      imageGenerations: { orderBy: { createdAt: "desc" } },
      videoGenerations: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!project) {
    return <div className="card p-4">Project not found.</div>;
  }

  return (
    <div className="space-y-4">
      <header className="card space-y-2 p-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-sm text-muted-foreground">Niche: {project.niche}</p>
        <p className="text-sm text-muted-foreground">Base prompt: {project.basePrompt}</p>
        <form action={`/api/projects/${project.id}/duplicate`} method="post">
          <button className="rounded-lg bg-white/10 px-3 py-2 text-sm">Duplicate project</button>
        </form>
        <Link href="/" className="rounded-lg bg-white/10 px-3 py-2 text-sm inline-block">Back to studio</Link>
      </header>

      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">Image generations</h2>
        <div className="space-y-2 text-sm">
          {project.imageGenerations.map((item) => (
            <div key={item.id} className="rounded border border-white/10 p-2">
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Provider:</strong> {item.providerId}</p>
              <p><strong>Prompt:</strong> {item.prompt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">Video generations</h2>
        <div className="space-y-2 text-sm">
          {project.videoGenerations.map((item) => (
            <div key={item.id} className="rounded border border-white/10 p-2">
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Provider:</strong> {item.providerId}</p>
              <p><strong>Prompt:</strong> {item.prompt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
