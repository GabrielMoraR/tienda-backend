import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura el almacenamiento con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "productos",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Crea la instancia de multer con el storage configurado
const upload = multer({ storage });

// ✅ Exportación correcta para ES Modules
export default upload;
