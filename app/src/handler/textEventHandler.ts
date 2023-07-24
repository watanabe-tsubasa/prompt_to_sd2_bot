import { config } from "dotenv";
import { ClientConfig, Client, WebhookEvent, TextMessage, MessageAPIResponseBase, ImageMessage } from "@line/bot-sdk";
import { writeSdPrompt } from "../module/writeSdPrompt";
import { sdDrawImage } from "../module/sdDrawImage";
import { upGyazo } from "../module/upGyazo";
config();

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(clientConfig);

const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {return;}
  const { replyToken } = event;
  const { text } = event.message;
  const { userId } = event.source;
  const response: TextMessage = {
    type: 'text',
    text: '... now Drawing'
  };
  client.replyMessage(replyToken, response);
  
  const sdPrompt = await writeSdPrompt(text);
  console.log(sdPrompt);
  const { prompt, negativePrompt } = sdPrompt
  const imageBlob = await sdDrawImage(prompt, negativePrompt)
  const res = await upGyazo(imageBlob);
  const { url, thumb_url} = res
  const imageResponse: ImageMessage = {
    type: 'image',
    originalContentUrl: url,
    previewImageUrl: thumb_url
  };
  return await client.pushMessage(userId, imageResponse);
}

export { textEventHandler };