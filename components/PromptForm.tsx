"use client";

const STYLE_PRESETS = [
  "Wedding Grazing Table",
  "Engagement Charcuterie",
  "Cute Animal Food Art",
  "Tropical Island Board",
  "Luxury Event Platter",
  "Baby Shower Board",
  "Birthday Board"
];

export function PromptForm({
  contentIdea,
  setContentIdea,
  theme,
  setTheme,
  stylePreset,
  setStylePreset,
  negativePrompt,
  setNegativePrompt,
  onGenerate,
  onRegeneratePrompt,
  basePrompt,
  copyPrompt
}: {
  contentIdea: string;
  setContentIdea: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  stylePreset: string;
  setStylePreset: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  onGenerate: () => void;
  onRegeneratePrompt: () => void;
  basePrompt: string;
  copyPrompt: () => void;
}) {
  return (
    <section className="card space-y-4 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Content idea</span>
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            value={contentIdea}
            onChange={(e) => setContentIdea(e.target.value)}
            placeholder="e.g. giant wedding charcuterie centerpiece"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Theme</span>
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. blush gold romantic"
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Style preset</span>
          <select
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            value={stylePreset}
            onChange={(e) => setStylePreset(e.target.value)}
          >
            {STYLE_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">Negative prompt</span>
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="blurry, low detail, cartoon"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted-foreground">Generated prompt</span>
        <textarea readOnly value={basePrompt} rows={4} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2" />
      </label>
      <div className="flex flex-wrap gap-2">
        <button onClick={onRegeneratePrompt} className="rounded-lg bg-white/10 px-4 py-2 text-sm">
          Regenerate Prompt
        </button>
        <button onClick={copyPrompt} className="rounded-lg bg-white/10 px-4 py-2 text-sm">
          Copy Prompt
        </button>
        <button onClick={onGenerate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
          Generate Image Proposals
        </button>
      </div>
    </section>
  );
}
