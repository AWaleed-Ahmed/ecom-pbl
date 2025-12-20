import express from "express";
import * as cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", cartController.getCart);
router.post("/:userId/add", cartController.addToCart);
router.delete("/:userId/remove/:productId", cartController.removeFromCart);

export default router;
