//need fix
//random URL fix
//fetchImages function fix needed

import express from "express";
import { createClient } from "pexels";
import dotenv from "dotenv";
dotenv.config();
const api = process.env.PEXELS || "";
const client = createClient(api);

export const imageCall = async (
  // this function should return random url from the fetch images url
  req: express.Request,
  res: express.Response
) => {
  try {
    const imageUrls: string[] = await fetchImagesP(req, res);

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(500).json({ error: "Failed to fetch image URLs" });
    }

    const randomUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    res.status(200).json(randomUrl);
  } catch (error) {
    console.error("Error making request:", error);
    res.status(500).json({ error: "Failed to make request" });
  }
};

const fetchImagesP = async (req: any, res: any) => {
  try {
    // const id = req.body.id;
    const query = req.body.query;

    if (!query) {
      return res.status(400).json({ error: "Provide 'query'." });
    }

    const photos = await client.collections.media({
      id: query,
      per_page: 15,
      type: "photos",
    });

    if ("media" in photos) {
      const srcUrls = photos.media
        .filter((media: any) => media.type === "Photo")
        .map((media: any) => media.src.original);
      return srcUrls;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
