import express from "express";
import * as http from "http";

const imageUrls: string[] = [
  "https://images.pexels.com/photos/61120/pexels-photo-61120.jpeg",
  "https://images.pexels.com/photos/398078/pexels-photo-398078.jpeg",
  "https://images.pexels.com/photos/993874/pexels-photo-993874.jpeg",
  "https://images.pexels.com/photos/1082526/pexels-photo-1082526.jpeg",
  "https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg",
  "https://images.pexels.com/photos/1957154/pexels-photo-1957154.jpeg",
  "https://images.pexels.com/photos/2068349/pexels-photo-2068349.jpeg",
  "https://images.pexels.com/photos/2343661/pexels-photo-2343661.jpeg",
  "https://images.pexels.com/photos/3066531/pexels-photo-3066531.jpeg",
];

export const imageCall = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    const { host, pathname } = new URL(randomUrl);

    const options: http.RequestOptions = {
      method: "GET",
      hostname: host,
      path: pathname,
    };

    const reqPexels = http.request(options, (response) => {
      const chunks: Uint8Array[] = [];

      response.on("data", (chunk) => {
        chunks.push(chunk);
      });

      response.on("end", () => {
        const data = Buffer.concat(chunks);
        console.log(
          `Request to ${randomUrl} successful. Response data length: ${data.length}`
        );
        res.status(200).json({ imageUrl: randomUrl });
      });
    });

    reqPexels.on("error", (error) => {
      console.error(`Error making request to ${randomUrl}:`, error.message);
      res.status(500).json({ error: "Failed to make request" });
    });

    reqPexels.end();
  } catch (error) {
    console.error("Error making request:", error);
    res.status(500).json({ error: "Failed to make request" });
  }
};
