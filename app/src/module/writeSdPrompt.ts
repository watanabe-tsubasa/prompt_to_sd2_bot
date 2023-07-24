import { Configuration, OpenAIApi } from "openai";

type sdPromptType = {
  prompt: string;
  negativePrompt: string
}

const writeSdPrompt = async (basePrompt: string) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  const functions = [
      {
          "name": "getPromptAndNegativePrompt",
          "description": "provide both the prompt and the negative prompt that the user will give to the AI model.",
          "parameters": {
              "type": "object",
              "properties": {
                  "prompt": {
                      "type": "string",
                      "description": `Words you want AI-artist to draw and Words meaning high quality
                       example: masterpiece, best quality, and user want to draw`,
                  },
                  "negativePrompt": {
                      "type": "string",
                      "description": `Conditions you do not want AI-artist to draw and low quality and Words meaning low quality 
                      example: low quality, worst quality, out of focus, and user don't want to draw`,
                  },
              },
              "required": ["prompt", "negativePrompt"],
          },
      }
  ]
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        "role": "system",
        "content": `You are an amazing AI artist.
        Please provide both the prompt and the negative prompt that the user will give to the AI model.
        Additionaly, write the Words meaning high quality to prompt and write the Words meaning low quality to negative prompt`
      },
      {
        role: "user", content: basePrompt //"青いかみの可愛い女の子を書いてほしいです。指は6本以上にならないようにしてください。文字も入れないでください。きれいに可愛く描いてください。低品質にならないようにお願いします。"
      }
    ],
    functions: functions
  });
  const sdPromptJsonString = completion.data.choices[0].message.function_call.arguments;
  const sdPrompt: sdPromptType = JSON.parse(sdPromptJsonString);
  return sdPrompt;
}

export { writeSdPrompt };