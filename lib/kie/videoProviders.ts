import { NormalizedTask, VideoProviderConfig } from "@/lib/kie/types";

const parseCommonTask = (raw: any): NormalizedTask => {
  const taskId = raw?.taskId ?? raw?.id ?? raw?.data?.taskId ?? "";
  const statusRaw = String(raw?.status ?? raw?.data?.status ?? "pending").toLowerCase();
  const status =
    statusRaw.includes("success") || statusRaw.includes("completed")
      ? "completed"
      : statusRaw.includes("fail")
        ? "failed"
        : statusRaw.includes("process") || statusRaw.includes("running")
          ? "processing"
          : "pending";
  const resultUrls = raw?.resultUrls ?? raw?.data?.videos ?? raw?.videos ?? raw?.output ?? [];

  return {
    taskId,
    status,
    resultUrls: Array.isArray(resultUrls) ? resultUrls : [],
    raw
  };
};

const baseFields = [
  { key: "prompt", label: "Prompt", type: "text", required: true },
  { key: "duration", label: "Duration", type: "select", required: true },
  { key: "aspectRatio", label: "Aspect ratio", type: "select", required: true },
  { key: "cameraMovement", label: "Camera movement", type: "select", required: true },
  { key: "audioMode", label: "Audio mode", type: "select", required: true }
] as const;

export const videoProviders: VideoProviderConfig[] = [
  {
    id: "veo-3-1",
    label: "Veo 3.1",
    provider: "kie",
    endpoint: "/api/v1/veo/generate",
    statusEndpoint: "/api/v1/veo/status",
    method: "POST",
    supportedModes: ["image-to-video", "text-to-video"],
    defaultParams: { model: "veo3_1", aspectRatio: "9:16" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "veo3_1",
      generationType: "IMAGE_2_VIDEO",
      prompt: params.prompt,
      imageUrls: params.imageUrls,
      duration: params.duration,
      aspectRatio: params.aspectRatio,
      audioMode: params.audioMode
    }),
    resultParser: parseCommonTask
  },
  {
    id: "veo-3-1-fast",
    label: "Veo 3.1 Fast",
    provider: "kie",
    endpoint: "/api/v1/veo/generate",
    statusEndpoint: "/api/v1/veo/status",
    method: "POST",
    supportedModes: ["image-to-video", "text-to-video", "first-last-frame"],
    defaultParams: { model: "veo3_fast", aspectRatio: "9:16" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "veo3_fast",
      generationType: "IMAGE_2_VIDEO",
      prompt: params.prompt,
      imageUrls: params.imageUrls,
      aspectRatio: params.aspectRatio,
      duration: params.duration,
      audioMode: params.audioMode
    }),
    resultParser: parseCommonTask
  },
  {
    id: "runway-aleph",
    label: "Runway Aleph",
    provider: "kie",
    endpoint: "/api/v1/runway/aleph/generate",
    statusEndpoint: "/api/v1/runway/aleph/status",
    method: "POST",
    supportedModes: ["image-to-video"],
    defaultParams: { model: "runway_aleph", aspectRatio: "16:9" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "runway_aleph",
      prompt: params.prompt,
      image_url: params.imageUrls[0],
      duration: params.duration,
      ratio: params.aspectRatio
    }),
    resultParser: parseCommonTask
  },
  {
    id: "runway-video",
    label: "Runway Video",
    provider: "kie",
    endpoint: "/api/v1/runway/video/generate",
    statusEndpoint: "/api/v1/runway/video/status",
    method: "POST",
    supportedModes: ["image-to-video"],
    defaultParams: { model: "runway_video", aspectRatio: "16:9" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "runway_video",
      prompt: params.prompt,
      imageUrls: params.imageUrls,
      duration: params.duration,
      aspectRatio: params.aspectRatio
    }),
    resultParser: parseCommonTask
  },
  {
    id: "grok-imagine",
    label: "Grok Imagine (availability may vary)",
    provider: "kie",
    endpoint: "/api/v1/grok/imagine/video",
    statusEndpoint: "/api/v1/grok/imagine/status",
    method: "POST",
    supportedModes: ["image-to-video", "text-to-video"],
    defaultParams: { model: "grok-imagine-video", aspectRatio: "9:16" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "grok-imagine-video",
      prompt: params.prompt,
      image_url: params.imageUrls[0],
      duration: params.duration,
      aspect_ratio: params.aspectRatio
    }),
    resultParser: parseCommonTask
  },
  {
    id: "topaz-video-upscale",
    label: "Topaz Video Upscale (availability may vary)",
    provider: "kie",
    endpoint: "/api/v1/topaz/upscale",
    statusEndpoint: "/api/v1/topaz/upscale/status",
    method: "POST",
    supportedModes: ["video-upscale"],
    defaultParams: { model: "topaz-video-upscale", upscale: "2x" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "topaz-video-upscale",
      prompt: params.prompt,
      source_image: params.imageUrls[0],
      duration: params.duration,
      aspectRatio: params.aspectRatio
    }),
    resultParser: parseCommonTask
  }
];

// TODO: Verify each video provider endpoint and payload with official KIE.AI docs per model.

export const getVideoProviderById = (id: string) => videoProviders.find((provider) => provider.id === id);
