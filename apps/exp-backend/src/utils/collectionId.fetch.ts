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

// export const fetchIdFromTitle = async (req: any, res: any) => {
//   const { title } = req.params;

//   try {
//     const result = await client.collections.all({ per_page: 15 });

//     if ("collections" in result) {
//       const collection = result.collections.find(
//         (c: { title: any }) => c.title === title
//       );

//       if (collection) {
//         res.json({ id: collection.id, title: collection.title });
//       } else {
//         res.status(404).json({ error: "Collection not found" });
//       }
//     } else {
//       res.status(500).json({ error: "Failed to fetch collections" });
//     }
//   } catch (error) {
//     console.error("Error fetching id from title:", error);
//     res.status(500).json({ error: "Failed to fetch id from title" });
//   }
// };

// export const fetchTitleFromId = async (req: any, res: any) => {
//   const { id } = req.params;

//   try {
//     const result = await client.collections.all({ per_page: 15 });

//     if ("collections" in result) {
//       const collection = result.collections.find(
//         (c: { id: any }) => c.id === id
//       );

//       if (collection) {
//         res.json({ id: collection.id, title: collection.title });
//       } else {
//         res.status(404).json({ error: "Collection not found" });
//       }
//     } else {
//       res.status(500).json({ error: "Failed to fetch collections" });
//     }
//   } catch (error) {
//     console.error("Error fetching title from id:", error);
//     res.status(500).json({ error: "Failed to fetch title from id" });
//   }
// };
