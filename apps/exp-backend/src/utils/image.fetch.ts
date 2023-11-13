import { createClient } from "pexels";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const api = process.env.PEXELS || "";
const client = createClient(api);
const query = "fashion";
const id = "xywsbzf";

export const fetchImages = async (req: any, res: any) => {
  try {
    const photos = await client.collections.media({
      id,
      per_page: 15,
      type: "photos",
    });

    console.log(photos);

    if ("media" in photos) {
      const srcUrls = photos.media
        .filter((media: any) => media.type === "Photo")
        .map((media: any) => media.src.small);

      console.log(srcUrls);
      res.json(srcUrls);
      return srcUrls;
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
