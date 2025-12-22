import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.addProduct);
router.delete("/:id", productController.removeProduct);
router.get("/:id/recommendations", productController.getRecommendations);

export default router;
