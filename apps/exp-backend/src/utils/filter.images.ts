//NEED FIX

import { Request, Response } from "express";
import { fetchImages } from "./image.fetch";

export const cart = async (req: Request, res: Response) => {
  try {
    const urls: any = await fetchImages(res, req);
    console.log(urls); // Logs the URL at the specified index
    return urls;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};
