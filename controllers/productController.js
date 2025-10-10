import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: ProductVariant, as: "variants" },
      order: [["id", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error("❌ Error getProducts:", err.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: ProductVariant, as: "variants" },
    });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    console.error("❌ Error getProductById:", err.message);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, variants } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const product = await Product.create({
      name,
      price,
      description,
      category,
      subcategory,
      image: imageUrl,
    });

    if (variants) {
      const parsed = JSON.parse(variants);
      for (const v of parsed) {
        await ProductVariant.create({
          product_id: product.id,
          color: v.color,
          size: v.size,
          stock: Number(v.stock),
        });
      }
    }

    const fullProduct = await Product.findByPk(product.id, { include: "variants" });
    res.status(201).json(fullProduct);
  } catch (err) {
    console.error("❌ Error createProduct:", err.message, err.stack);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, variants } = req.body;
    const id = req.params.id;

    const updateData = { name, price, description, category, subcategory };

    if (req.file) updateData.image = req.file.path;

    await Product.update(updateData, { where: { id } });

    if (variants) {
      await ProductVariant.destroy({ where: { product_id: id } });
      const parsed = JSON.parse(variants);
      for (const v of parsed) {
        await ProductVariant.create({
          product_id: id,
          color: v.color,
          size: v.size,
          stock: Number(v.stock),
        });
      }
    }

    const updated = await Product.findByPk(id, { include: "variants" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updateProduct:", err.message, err.stack);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("❌ Error deleteProduct:", err.message);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
