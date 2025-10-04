import jwt from "jsonwebtoken";

// Middleware: verificar token JWT
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No autorizado: token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos datos del usuario en la request
    req.userId = decoded.id;   // 👈 ID del usuario
    req.role = decoded.role;   // 👈 "user" o "admin"

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

// Middleware: solo admins
export const isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
};
