import { TaskStatusBadge } from "@/components/TaskStatusBadge";

export function ImageCard({
  imageUrl,
  status,
  prompt,
  isSelected,
  onSelect,
  onRegenerate
}: {
  imageUrl?: string;
  status: string;
  prompt: string;
  isSelected: boolean;
  onSelect: () => void;
  onRegenerate: () => void;
}) {
  return (
    <article className="card space-y-3 p-3">
      <div className="aspect-[4/5] overflow-hidden rounded-lg bg-black/40">
        {imageUrl ? <img src={imageUrl} alt="Generated concept" className="h-full w-full object-cover" /> : <div className="p-4 text-sm">No image yet</div>}
      </div>
      <TaskStatusBadge status={status} />
      <p className="line-clamp-3 text-xs text-muted-foreground">{prompt}</p>
      <div className="flex gap-2">
        <button
          onClick={onSelect}
          className={`rounded-lg px-3 py-2 text-xs ${isSelected ? "bg-green-600 text-white" : "bg-white/10"}`}
        >
          Select this image
        </button>
        <button onClick={onRegenerate} className="rounded-lg bg-white/10 px-3 py-2 text-xs">
          Regenerate variation
        </button>
      </div>
    </article>
  );
}
