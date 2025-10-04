import express from "express";
import multer from "multer";
import path from "path";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", verifyToken, isAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
