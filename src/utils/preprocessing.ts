/**
 * Multimodal input preprocessing utilities
 */

import { PreprocessedInput } from '@/types';

export async function preprocessImage(base64Image: string): Promise<PreprocessedInput> {
  const metadata = {
    size: base64Image.length,
    format: base64Image.split(',')[0],
    timestamp: new Date().toISOString(),
  };
  const content = `[IMAGE] Image file (${metadata.size} bytes) received for analysis.`;
  return { type: 'image', content, metadata };
}

export async function preprocessAudio(base64Audio: string): Promise<PreprocessedInput> {
  const metadata = {
    size: base64Audio.length,
    format: base64Audio.split(',')[0],
    timestamp: new Date().toISOString(),
  };
  const content = `[AUDIO] Audio file (${metadata.size} bytes) received for analysis.`;
  return { type: 'audio', content, metadata };
}

export async function preprocessVideo(base64Video: string): Promise<PreprocessedInput> {
  const metadata = {
    size: base64Video.length,
    format: base64Video.split(',')[0],
    timestamp: new Date().toISOString(),
  };
  const content = `[VIDEO] Video file (${metadata.size} bytes) received for analysis.`;
  return { type: 'video', content, metadata };
}

export async function preprocessText(text: string): Promise<PreprocessedInput> {
  return {
    type: 'text',
    content: text.trim(),
    metadata: { length: text.length, timestamp: new Date().toISOString() },
  };
}

export async function preprocessInput(
  text: string,
  image?: string,
  audio?: string,
  video?: string
): Promise<PreprocessedInput[]> {
  const inputs: PreprocessedInput[] = [];
  if (text && text.trim().length > 0) inputs.push(await preprocessText(text));
  if (image) inputs.push(await preprocessImage(image));
  if (audio) inputs.push(await preprocessAudio(audio));
  if (video) inputs.push(await preprocessVideo(video));
  if (inputs.length === 0) throw new Error('No input provided');
  return inputs;
}
