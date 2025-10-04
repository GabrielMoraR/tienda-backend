import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";

// Obtener todos los productos con variantes
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: ProductVariant, as: "variants" },
      order: [["id", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: ProductVariant, as: "variants" },
    });
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

// Crear producto con variantes
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, variants } = req.body;
    const imageFile = req.file ? req.file.filename : null;

    const product = await Product.create({
      name, price, description, category, subcategory, image: imageFile,
    });

    if (variants) {
      const parsed = JSON.parse(variants);
      for (const v of parsed) {
        await ProductVariant.create({
          product_id: product.id,
          color: v.color,
          size: v.size,
          stock: v.stock,
        });
      }
    }

    const fullProduct = await Product.findByPk(product.id, { include: "variants" });
    res.status(201).json(fullProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear producto" });
  }
};

// Actualizar producto con variantes
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, variants } = req.body;
    const id = req.params.id;

    const updateData = { name, price, description, category, subcategory };
    if (req.file) updateData.image = req.file.filename;

    await Product.update(updateData, { where: { id } });

    // limpiar variantes previas y volver a crearlas
    if (variants) {
      await ProductVariant.destroy({ where: { product_id: id } });
      const parsed = JSON.parse(variants);
      for (const v of parsed) {
        await ProductVariant.create({
          product_id: id,
          color: v.color,
          size: v.size,
          stock: v.stock,
        });
      }
    }

    const updated = await Product.findByPk(id, { include: "variants" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
};
