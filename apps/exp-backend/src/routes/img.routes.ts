import express from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { fetchImages } from "../utils/image.fetch";
import {
  fetchCollectionInfo,
  fetchCollections,
} from "../utils/collectionId.fetch";
import { cartProductImg } from "../utils/filter.images";

const router = express.Router();

router.get("/img/:id", fetchImages);
router.get("/collection", fetchCollections);
router.get("/collection/:idOrTitle", fetchCollectionInfo);
router.get("/user", authenticateUser, cartProductImg);

export default router;
