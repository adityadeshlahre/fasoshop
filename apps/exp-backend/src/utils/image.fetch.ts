//need fix

import { createClient } from "pexels";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const api = process.env.PEXELS || "";
const client = createClient(api);

export const fetchImages = async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const query = req.params.query;

    if (id && query) {
      return res
        .status(400)
        .json({ error: "Provide either 'id' or 'query', not both." });
    }

    const photos = await client.collections.media({
      id: id || query,
      per_page: 15,
      type: "photos",
    });

    // console.log(photos);

    if ("media" in photos) {
      const srcUrls = photos.media
        .filter((media: any) => media.type === "Photo")
        .map((media: any) => media.src.original);

      console.log(srcUrls);
      res.json(srcUrls);
      return;
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
