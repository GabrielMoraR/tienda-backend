// testCloudinary.js
import fs from "fs";
import path from "path";
import { cloudinary } from "./config/cloudinary.js";

const uploadTestImage = async () => {
  try {
    // Ruta de la imagen de prueba en tu PC
    const imagePath = path.join(process.cwd(), "test-image.png");

    // Verificar que el archivo exista
    if (!fs.existsSync(imagePath)) {
      console.error("❌ No se encontró test-image.jpg en la raíz del proyecto");
      return;
    }

    // Subida a Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "tienda/test", // Se crea dentro de tu carpeta 'tienda'
    });

    console.log("✅ Imagen subida correctamente!");
    console.log("URL:", result.secure_url);
  } catch (err) {
    console.error("❌ Error subiendo la imagen:", err);
  }
};

uploadTestImage();
