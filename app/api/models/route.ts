import { imageProviders } from "@/lib/kie/imageProviders";
import { videoProviders } from "@/lib/kie/videoProviders";

export async function GET() {
  return Response.json({
    imageModels: imageProviders.map(({ resultParser, buildPayload, ...rest }) => rest),
    videoModels: videoProviders.map(({ resultParser, buildPayload, ...rest }) => rest)
  });
}
