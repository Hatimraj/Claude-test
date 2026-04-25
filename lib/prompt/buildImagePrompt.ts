export type ImagePromptInput = {
  contentIdea: string;
  theme: string;
  stylePreset: string;
  negativePrompt?: string;
};

export const buildImagePrompt = ({ contentIdea, theme, stylePreset, negativePrompt }: ImagePromptInput) => {
  const core = [
    `Ultra realistic food photography focused on ${contentIdea}`,
    `Theme: ${theme}`,
    `Style preset: ${stylePreset}`,
    "3D volume with physically achievable edible construction",
    "abundant composition with realistic ingredients",
    "three-quarter angle 30–45 degrees",
    "natural light, DSLR look, social media viral style",
    "no flat lay, no CGI, no impossible sculpture"
  ];

  if (negativePrompt?.trim()) {
    core.push(`Negative prompt constraints: ${negativePrompt.trim()}`);
  }

  return core.join(", ");
};
