"use client";

import { TaskStatusBadge } from "@/components/TaskStatusBadge";

export function VideoPanel({
  prompt,
  setPrompt,
  duration,
  setDuration,
  cameraMovement,
  setCameraMovement,
  audioMode,
  setAudioMode,
  status,
  videoUrls,
  onGenerate,
  onCopyPrompt,
  onCopyUrl
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  duration: 4 | 8 | 12;
  setDuration: (value: 4 | 8 | 12) => void;
  cameraMovement: "pov-handheld" | "slow-push-in" | "orbit" | "plate-rotation-with-hands" | "macro-pull-back";
  setCameraMovement: (value: "pov-handheld" | "slow-push-in" | "orbit" | "plate-rotation-with-hands" | "macro-pull-back") => void;
  audioMode: "natural-sounds" | "soft-instrumental" | "silent";
  setAudioMode: (value: "natural-sounds" | "soft-instrumental" | "silent") => void;
  status?: string;
  videoUrls: string[];
  onGenerate: () => void;
  onCopyPrompt: () => void;
  onCopyUrl: (url: string) => void;
}) {
  return (
    <section className="card space-y-4 p-4">
      <h3 className="text-lg font-semibold">Step 3 · Generate video</h3>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={8} className="w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm" />
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm">
          Duration
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value) as 4 | 8 | 12)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            {[4, 8, 12].map((v) => (
              <option key={v} value={v}>{v}s</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Camera
          <select value={cameraMovement} onChange={(e) => setCameraMovement(e.target.value as any)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <option value="pov-handheld">POV handheld</option>
            <option value="slow-push-in">slow push-in</option>
            <option value="orbit">orbit</option>
            <option value="plate-rotation-with-hands">plate rotation with hands</option>
            <option value="macro-pull-back">macro pull-back</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Audio
          <select value={audioMode} onChange={(e) => setAudioMode(e.target.value as any)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <option value="natural-sounds">no music, natural sounds only</option>
            <option value="soft-instrumental">soft instrumental</option>
            <option value="silent">silent</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={onGenerate} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Generate Video</button>
        <button onClick={onCopyPrompt} className="rounded-lg bg-white/10 px-4 py-2 text-sm">Copy Video Prompt</button>
        {status && <TaskStatusBadge status={status} />}
      </div>
      {videoUrls.length > 0 && (
        <div className="space-y-2">
          {videoUrls.map((url) => (
            <div key={url} className="space-y-2 rounded-lg border border-white/10 p-2">
              <video controls className="w-full rounded-lg" src={url} />
              <div className="flex gap-2">
                <a className="rounded-lg bg-white/10 px-3 py-1 text-xs" href={url} target="_blank" rel="noreferrer" download>
                  Download
                </a>
                <button className="rounded-lg bg-white/10 px-3 py-1 text-xs" onClick={() => onCopyUrl(url)}>
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
