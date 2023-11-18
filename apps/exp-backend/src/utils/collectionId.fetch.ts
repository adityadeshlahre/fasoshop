//NEED FIX
import { createClient } from "pexels";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const api = process.env.PEXELS || "";
const client = createClient(api);

export const fetchCollections = async (req: any, res: any) => {
  try {
    const result = await client.collections.all({ per_page: 15 });

    if ("collections" in result) {
      const collectionInfo = result.collections.map(
        (collection: { id: any; title: any }) => ({
          id: collection.id,
          title: collection.title,
        })
      );

      res.json(collectionInfo);
    } else {
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

export const fetchCollectionInfo = async (req: any, res: any) => {
  const { idOrTitle } = req.params;

  try {
    const result = await client.collections.all({ per_page: 15 });

    if ("collections" in result) {
      const collection = result.collections.find(
        (c: { id: any; title: any }) =>
          c.id === idOrTitle || c.title === idOrTitle
      );

      if (collection) {
        res.json({ id: collection.id, title: collection.title });
      } else {
        res.status(404).json({ error: "Collection not found" });
      }
    } else {
      res.status(500).json({ error: "Failed to fetch collections" });
    }
  } catch (error) {
    console.error("Error fetching collection info:", error);
    res.status(500).json({ error: "Failed to fetch collection info" });
  }
};
