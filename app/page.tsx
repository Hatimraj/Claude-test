"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { PromptForm } from "@/components/PromptForm";
import { SettingsPanel } from "@/components/SettingsPanel";
import { VideoPanel } from "@/components/VideoPanel";
import { buildImagePrompt } from "@/lib/prompt/buildImagePrompt";
import { buildVideoPrompt } from "@/lib/prompt/buildVideoPrompt";
import { useStudioStore } from "@/lib/store/useStudioStore";

type Model = { id: string; label: string };

export default function HomePage() {
  const [imageModels, setImageModels] = useState<Model[]>([]);
  const [videoModels, setVideoModels] = useState<Model[]>([]);
  const [contentIdea, setContentIdea] = useState("Luxury wedding grazing table centerpiece");
  const [theme, setTheme] = useState("soft cream blush gold wedding decor");
  const [stylePreset, setStylePreset] = useState("Wedding Grazing Table");
  const [negativePrompt, setNegativePrompt] = useState("flat lay, cgi, impossible sculpture");
  const [imageModel, setImageModel] = useState("nano-banana");
  const [videoModel, setVideoModel] = useState("veo-3-1-fast");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "9:16" | "16:9">("4:5");
  const [count, setCount] = useState<1 | 2 | 4>(2);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [duration, setDuration] = useState<4 | 8 | 12>(8);
  const [cameraMovement, setCameraMovement] = useState<"pov-handheld" | "slow-push-in" | "orbit" | "plate-rotation-with-hands" | "macro-pull-back">("pov-handheld");
  const [audioMode, setAudioMode] = useState<"natural-sounds" | "soft-instrumental" | "silent">("natural-sounds");
  const [error, setError] = useState<string | null>(null);

  const {
    projectId,
    setProjectId,
    imageGenerations,
    upsertImageGeneration,
    selectedImageGenerationId,
    setSelectedImageGenerationId,
    videoGeneration,
    setVideoGeneration
  } = useStudioStore();

  const basePrompt = useMemo(
    () => buildImagePrompt({ contentIdea, theme, stylePreset, negativePrompt }),
    [contentIdea, theme, stylePreset, negativePrompt]
  );

  useEffect(() => {
    const loadModels = async () => {
      const response = await fetch("/api/models");
      const data = await response.json();
      setImageModels(data.imageModels.map((m: any) => ({ id: m.id, label: m.label })));
      setVideoModels(data.videoModels.map((m: any) => ({ id: m.id, label: m.label })));
    };

    loadModels().catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedImageGenerationId) {
      return;
    }
    setVideoPrompt(
      buildVideoPrompt({
        prompt: "Transform this exact approved food art board into a premium social media short",
        duration,
        cameraMovement,
        audioMode
      })
    );
  }, [selectedImageGenerationId, duration, cameraMovement, audioMode]);

  useEffect(() => {
    const pending = imageGenerations.filter((generation) => ["pending", "processing"].includes(generation.status));
    if (pending.length === 0) return;

    const interval = setInterval(async () => {
      for (const generation of pending) {
        const response = await fetch("/api/image/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generationId: generation.id })
        });
        const data = await response.json();
        upsertImageGeneration({
          id: generation.id,
          status: data.status,
          prompt: generation.prompt,
          imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : []
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [imageGenerations, upsertImageGeneration]);

  useEffect(() => {
    if (!videoGeneration || !["pending", "processing"].includes(videoGeneration.status)) return;

    const interval = setInterval(async () => {
      const response = await fetch("/api/video/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoGenerationId: videoGeneration.id })
      });
      const data = await response.json();
      setVideoGeneration({
        id: videoGeneration.id,
        status: data.status,
        prompt: videoGeneration.prompt,
        videoUrls: Array.isArray(data.videoUrls) ? data.videoUrls : []
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [videoGeneration, setVideoGeneration]);

  const generateImages = async () => {
    setError(null);
    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: contentIdea,
          niche: "food-art-charcuterie",
          basePrompt,
          providerId: imageModel,
          prompt: basePrompt,
          negativePrompt,
          aspectRatio,
          outputFormat: "png",
          n: count
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image generation failed");

      setProjectId(data.projectId);
      upsertImageGeneration({ id: data.generationId, status: data.status, prompt: basePrompt, imageUrls: [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    }
  };

  const regenerateVariation = async (item: { prompt: string }) => {
    setError(null);
    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: contentIdea,
          niche: "food-art-charcuterie",
          basePrompt,
          providerId: imageModel,
          prompt: item.prompt,
          negativePrompt,
          aspectRatio,
          outputFormat: "png",
          n: 1
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Regeneration failed");

      setProjectId(data.projectId);
      upsertImageGeneration({ id: data.generationId, status: data.status, prompt: item.prompt, imageUrls: [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    }
  };

  const generateVideo = async () => {
    if (!projectId || !selectedImageGenerationId) return;
    setError(null);
    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          imageGenerationId: selectedImageGenerationId,
          providerId: videoModel,
          prompt: videoPrompt,
          duration,
          aspectRatio,
          cameraMovement,
          audioMode
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Video generation failed");

      setVideoGeneration({ id: data.videoGenerationId, prompt: videoPrompt, status: data.status, videoUrls: [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Viral Food Art Studio</h1>
        <p className="text-sm text-muted-foreground">
          Generate viral 3D charcuterie images, validate the best one, then turn it into a video.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <PromptForm
          contentIdea={contentIdea}
          setContentIdea={setContentIdea}
          theme={theme}
          setTheme={setTheme}
          stylePreset={stylePreset}
          setStylePreset={setStylePreset}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          onGenerate={generateImages}
          onRegeneratePrompt={() => setTheme((value) => `${value}`)}
          basePrompt={basePrompt}
          copyPrompt={() => navigator.clipboard.writeText(basePrompt)}
        />
        <SettingsPanel
          imageModel={imageModel}
          setImageModel={setImageModel}
          videoModel={videoModel}
          setVideoModel={setVideoModel}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          count={count}
          setCount={setCount}
          imageModels={imageModels}
          videoModels={videoModels}
        />
      </div>

      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Step 1 · Generate images</h3>
        <ImageGallery
          items={imageGenerations}
          selectedId={selectedImageGenerationId}
          onSelect={setSelectedImageGenerationId}
          onRegenerate={regenerateVariation}
        />
      </section>

      {selectedImageGenerationId && (
        <VideoPanel
          prompt={videoPrompt}
          setPrompt={setVideoPrompt}
          duration={duration}
          setDuration={setDuration}
          cameraMovement={cameraMovement}
          setCameraMovement={setCameraMovement}
          audioMode={audioMode}
          setAudioMode={setAudioMode}
          status={videoGeneration?.status}
          videoUrls={videoGeneration?.videoUrls ?? []}
          onGenerate={generateVideo}
          onCopyPrompt={() => navigator.clipboard.writeText(videoPrompt)}
          onCopyUrl={(url) => navigator.clipboard.writeText(url)}
        />
      )}

      {projectId && (
        <a href={`/projects/${projectId}`} className="inline-block rounded-lg bg-white/10 px-4 py-2 text-sm">
          Open project history
        </a>
      )}
    </div>
  );
}
