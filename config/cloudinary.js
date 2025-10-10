import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "productos", // carpeta donde se subirán las imágenes
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Exportación correcta (ESM)
const upload = multer({ storage });
export default upload;
