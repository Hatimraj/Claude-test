import { ImageCard } from "@/components/ImageCard";

type Item = {
  id: string;
  status: string;
  prompt: string;
  imageUrls: string[];
};

export function ImageGallery({
  items,
  selectedId,
  onSelect,
  onRegenerate
}: {
  items: Item[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onRegenerate: (item: Item) => void;
}) {
  if (items.length === 0) {
    return <section className="card p-4 text-sm text-muted-foreground">No generated images yet.</section>;
  }

  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold">Step 2 · Select image</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ImageCard
            key={item.id}
            imageUrl={item.imageUrls[0]}
            status={item.status}
            prompt={item.prompt}
            isSelected={selectedId === item.id}
            onSelect={() => onSelect(item.id)}
            onRegenerate={() => onRegenerate(item)}
          />
        ))}
      </div>
    </section>
  );
}
