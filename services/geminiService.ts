
import { GoogleGenAI, Modality } from "@google/genai";

// Use process.env.API_KEY directly in the named parameter object
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Basic Text Task: 'gemini-3-flash-preview'
export const generateAffirmation = async (category: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 powerful, present-tense manifestation affirmations for the category: ${category}. Return only the affirmations separated by newlines. No extra text.`,
  });
  // Accessing the .text property directly as per SDK requirements
  return response.text?.split('\n').filter(t => t.trim().length > 0) || [];
};

// Image Generation Task: 'gemini-2.5-flash-image'
export const generateVisionImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `An ethereal, cinematic, high-quality visualization of this dream: ${prompt}. Cinematic lighting, dreamlike atmosphere, artistic.` }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  // Find the image part by iterating through all response parts
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// Text-to-speech task: 'gemini-2.5-flash-preview-tts'
export const generateGuidedSpeech = async (script: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say calmly and with gentle pauses: ${script}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio;
};

// Utility to decode raw PCM audio bytes from base64 string
export const decodeAudio = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Utility to create an AudioBuffer from raw PCM data
export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
