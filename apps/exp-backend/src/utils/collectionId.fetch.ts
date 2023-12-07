//NEED FIX
import { createClient } from "pexels";
import dotenv from "dotenv";
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
  const { category } = req.body;

  try {
    const result = await client.collections.all({ per_page: 15 });

    if ("collections" in result) {
      const collection = result.collections.find(
        (c: { id: any; title: any }) =>
          c.id === category || c.title === category
      );

      if (collection) {
        if (collection.id === category) {
          return collection.title;
        } else {
          return collection.id;
        }
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
