import { config } from "dotenv";
config();

type gyazoResponse = {
  "image_id": string;
  "permalink_url": string;
  "thumb_url": string;
  "url": string;
  "type": string;
};

const upGyazo = async (file: Blob | Buffer): Promise<gyazoResponse> => {
  const url = "https://upload.gyazo.com/api/upload";
  const token = process.env.GYAZO_ACCESS_TOKEN;

  const formData = new FormData();
  formData.append("imagedata", new Blob([file]), "file.png");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // Handle the response error here if needed
      throw new Error("Failed to upload image");
    }

    const result = await res.json() as gyazoResponse;
    return result;
  } catch (error) {
    // Handle the fetch error here if needed
    throw new Error("Failed to upload image");
  }
};

export { upGyazo };
