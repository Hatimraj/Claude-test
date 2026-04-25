import { ImageProviderConfig, NormalizedTask } from "@/lib/kie/types";

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
  const resultUrls = raw?.resultUrls ?? raw?.data?.images ?? raw?.images ?? raw?.output ?? [];

  return {
    taskId,
    status,
    resultUrls: Array.isArray(resultUrls) ? resultUrls : [],
    raw
  };
};

const baseFields = [
  { key: "prompt", label: "Prompt", type: "text", required: true },
  { key: "negativePrompt", label: "Negative prompt", type: "text", required: false },
  { key: "aspectRatio", label: "Aspect ratio", type: "select", required: true },
  { key: "outputFormat", label: "Output format", type: "select", required: true },
  { key: "n", label: "Images count", type: "number", required: true }
] as const;

export const imageProviders: ImageProviderConfig[] = [
  {
    id: "nano-banana",
    label: "Nano Banana",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["text-to-image", "image-to-image"],
    defaultParams: { model: "google/nano-banana", output_format: "png", image_size: "4:5" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "google/nano-banana",
      input: {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        output_format: params.outputFormat,
        image_size: params.aspectRatio,
        n: params.n
      }
    }),
    resultParser: parseCommonTask
  },
  {
    id: "nano-banana-edit",
    label: "Nano Banana Edit",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["image-to-image"],
    defaultParams: { model: "google/nano-banana-edit", output_format: "png", image_size: "4:5" },
    fields: [...baseFields, { key: "referenceImageUrl", label: "Reference image URL", type: "text", required: true }],
    buildPayload: (params) => ({
      model: "google/nano-banana-edit",
      input: {
        prompt: params.prompt,
        image_url: params.referenceImageUrl,
        output_format: params.outputFormat,
        image_size: params.aspectRatio,
        n: params.n
      }
    }),
    resultParser: parseCommonTask
  },
  {
    id: "nano-banana-pro",
    label: "Nano Banana Pro",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["text-to-image", "image-to-image"],
    defaultParams: { model: "google/nano-banana-pro", output_format: "png", image_size: "4:5" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "google/nano-banana-pro",
      input: {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        output_format: params.outputFormat,
        image_size: params.aspectRatio,
        n: params.n
      }
    }),
    resultParser: parseCommonTask
  },
  {
    id: "4o-image",
    label: "4o Image",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["text-to-image"],
    defaultParams: { model: "openai/4o-image", output_format: "png", image_size: "1:1" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "openai/4o-image",
      input: {
        prompt: params.prompt,
        size: params.aspectRatio,
        n: params.n,
        output_format: params.outputFormat
      }
    }),
    resultParser: parseCommonTask
  },
  {
    id: "flux-kontext",
    label: "Flux Kontext",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["text-to-image", "image-to-image"],
    defaultParams: { model: "black-forest-labs/flux-kontext", output_format: "png", image_size: "4:5" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "black-forest-labs/flux-kontext",
      input: {
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        aspect_ratio: params.aspectRatio,
        output_format: params.outputFormat,
        num_images: params.n
      }
    }),
    resultParser: parseCommonTask
  },
  {
    id: "qwen-image-edit",
    label: "Qwen Image Edit",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["image-to-image"],
    defaultParams: { model: "qwen/qwen-image-edit", output_format: "png", image_size: "4:5" },
    fields: [...baseFields, { key: "referenceImageUrl", label: "Reference image URL", type: "text", required: true }],
    buildPayload: (params) => ({
      model: "qwen/qwen-image-edit",
      input: {
        image_url: params.referenceImageUrl,
        prompt: params.prompt,
        output_format: params.outputFormat,
        image_size: params.aspectRatio,
        n: params.n
      }
    }),
    resultParser: parseCommonTask
  },
  {
    id: "wan-image",
    label: "Wan Image (availability may vary)",
    provider: "kie",
    endpoint: "/api/v1/jobs/createTask",
    statusEndpoint: "/api/v1/jobs/getTask",
    method: "POST",
    supportedModes: ["text-to-image"],
    defaultParams: { model: "wan/wan-image", output_format: "png", image_size: "9:16" },
    fields: [...baseFields],
    buildPayload: (params) => ({
      model: "wan/wan-image",
      input: {
        prompt: params.prompt,
        aspect_ratio: params.aspectRatio,
        output_format: params.outputFormat,
        n: params.n
      }
    }),
    resultParser: parseCommonTask
  }
];

// TODO: Verify each image provider endpoint and payload with official KIE.AI docs per model.

export const getImageProviderById = (id: string) => imageProviders.find((provider) => provider.id === id);
