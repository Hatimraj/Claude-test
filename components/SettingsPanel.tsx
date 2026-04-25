import { ModelSelector } from "@/components/ModelSelector";

const aspectRatios = ["1:1", "4:5", "9:16", "16:9"];
const counts = [1, 2, 4];

export function SettingsPanel({
  imageModel,
  setImageModel,
  videoModel,
  setVideoModel,
  aspectRatio,
  setAspectRatio,
  count,
  setCount,
  imageModels,
  videoModels
}: {
  imageModel: string;
  setImageModel: (value: string) => void;
  videoModel: string;
  setVideoModel: (value: string) => void;
  aspectRatio: "1:1" | "4:5" | "9:16" | "16:9";
  setAspectRatio: (value: "1:1" | "4:5" | "9:16" | "16:9") => void;
  count: 1 | 2 | 4;
  setCount: (value: 1 | 2 | 4) => void;
  imageModels: Array<{ id: string; label: string }>;
  videoModels: Array<{ id: string; label: string }>;
}) {
  return (
    <section className="card space-y-4 p-4">
      <h3 className="text-lg font-semibold">Settings</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <ModelSelector label="Image model" value={imageModel} onChange={setImageModel} options={imageModels} />
        <ModelSelector label="Video model" value={videoModel} onChange={setVideoModel} options={videoModels} />
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Image format</span>
          <select
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as "1:1" | "4:5" | "9:16" | "16:9")}
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio} value={ratio}>
                {ratio}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Image proposals</span>
          <select
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            value={count}
            onChange={(e) => setCount(Number(e.target.value) as 1 | 2 | 4)}
          >
            {counts.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
