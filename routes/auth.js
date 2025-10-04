import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, telefono, direccion } = req.body; // agregamos telefono y direccion
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email ya registrado" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "user",
      phone: telefono,    // 👈 guardar teléfono
      address: direccion  // 👈 guardar dirección
    });


    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (e) {
    res.status(500).json({ message: "Error en registro" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch {
    res.status(500).json({ message: "Error en login" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findByPk(req.userId, {
    attributes: ["id", "name", "email", "role", "phone", "address"] // 👈 agregamos phone y address
  });
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(user);
});


export default router;
