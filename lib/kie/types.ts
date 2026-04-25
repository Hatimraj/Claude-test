export type TaskStatus = "pending" | "processing" | "completed" | "failed";

export type NormalizedTask = {
  taskId: string;
  status: TaskStatus;
  resultUrls?: string[];
  raw: unknown;
};

export type ProviderFieldType = "text" | "number" | "select" | "boolean";

export type ProviderField = {
  key: string;
  label: string;
  type: ProviderFieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
};

export type ImageTaskParams = {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: "1:1" | "4:5" | "9:16" | "16:9";
  outputFormat: "png" | "jpeg" | "webp";
  n: number;
  referenceImageUrl?: string;
};

export type VideoTaskParams = {
  prompt: string;
  imageUrls: string[];
  duration: 4 | 8 | 12;
  aspectRatio: "1:1" | "4:5" | "9:16" | "16:9";
  cameraMovement: "pov-handheld" | "slow-push-in" | "orbit" | "plate-rotation-with-hands" | "macro-pull-back";
  audioMode: "natural-sounds" | "soft-instrumental" | "silent";
};

export type ImageProviderConfig = {
  id: string;
  label: string;
  provider: "kie";
  endpoint: string;
  statusEndpoint: string;
  method: "POST" | "GET";
  supportedModes: string[];
  defaultParams: Record<string, unknown>;
  fields: ProviderField[];
  buildPayload: (params: ImageTaskParams) => Record<string, unknown>;
  resultParser: (raw: unknown) => NormalizedTask;
};

export type VideoProviderConfig = {
  id: string;
  label: string;
  provider: "kie";
  endpoint: string;
  statusEndpoint: string;
  method: "POST" | "GET";
  supportedModes: string[];
  defaultParams: Record<string, unknown>;
  fields: ProviderField[];
  buildPayload: (params: VideoTaskParams) => Record<string, unknown>;
  resultParser: (raw: unknown) => NormalizedTask;
};
