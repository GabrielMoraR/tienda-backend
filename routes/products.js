import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Importar el middleware de subida a Cloudinary
import upload from "../middleware/uploadCloudinary.js";

const router = express.Router();

// Rutas de productos
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", verifyToken, isAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
