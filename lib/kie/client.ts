import { env } from "@/lib/env";
import { getImageProviderById } from "@/lib/kie/imageProviders";
import { getVideoProviderById } from "@/lib/kie/videoProviders";
import { ImageTaskParams, NormalizedTask, VideoTaskParams } from "@/lib/kie/types";

const toNormalized = (raw: any): NormalizedTask => ({
  taskId: raw?.taskId ?? raw?.id ?? raw?.data?.taskId ?? "",
  status: raw?.status ?? "pending",
  resultUrls: raw?.resultUrls ?? [],
  raw
});

export const kieRequest = async <T = unknown>(
  endpoint: string,
  method: "POST" | "GET",
  body?: Record<string, unknown>
): Promise<T> => {
  const url = `${env.KIE_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.KIE_API_KEY}`
    },
    body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
    cache: "no-store"
  });

  let parsed: unknown;
  try {
    parsed = await response.json();
  } catch {
    throw new Error("Invalid JSON response from KIE API");
  }

  if (!response.ok) {
    throw new Error(`KIE API error ${response.status}: ${JSON.stringify(parsed)}`);
  }

  return parsed as T;
};

export const createImageTask = async (providerId: string, params: ImageTaskParams): Promise<NormalizedTask> => {
  const provider = getImageProviderById(providerId);
  if (!provider) {
    throw new Error(`Unknown image provider: ${providerId}`);
  }

  const raw = await kieRequest(provider.endpoint, provider.method, provider.buildPayload(params));
  const normalized = provider.resultParser(raw);
  return normalized.taskId ? normalized : toNormalized(raw);
};

export const getImageTaskStatus = async (providerId: string, taskId: string): Promise<NormalizedTask> => {
  const provider = getImageProviderById(providerId);
  if (!provider) {
    throw new Error(`Unknown image provider: ${providerId}`);
  }

  const raw = await kieRequest(provider.statusEndpoint, "POST", { taskId });
  const normalized = provider.resultParser(raw);
  return normalized.taskId ? normalized : { ...toNormalized(raw), taskId };
};

export const createVideoTask = async (providerId: string, params: VideoTaskParams): Promise<NormalizedTask> => {
  const provider = getVideoProviderById(providerId);
  if (!provider) {
    throw new Error(`Unknown video provider: ${providerId}`);
  }

  const raw = await kieRequest(provider.endpoint, provider.method, provider.buildPayload(params));
  const normalized = provider.resultParser(raw);
  return normalized.taskId ? normalized : toNormalized(raw);
};

export const getVideoTaskStatus = async (providerId: string, taskId: string): Promise<NormalizedTask> => {
  const provider = getVideoProviderById(providerId);
  if (!provider) {
    throw new Error(`Unknown video provider: ${providerId}`);
  }

  const raw = await kieRequest(provider.statusEndpoint, "POST", { taskId });
  const normalized = provider.resultParser(raw);
  return normalized.taskId ? normalized : { ...toNormalized(raw), taskId };
};
