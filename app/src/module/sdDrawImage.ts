import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HF_ACCESS_TOKEN);

const sdDrawImage = async (prompt: string, negativePrompt: string) => {
  const res = await inference.textToImage({
    model: 'stabilityai/stable-diffusion-2',
    inputs: prompt,
    parameters: {
      negative_prompt: negativePrompt,
    }
  });
  return res;
}

export { sdDrawImage };