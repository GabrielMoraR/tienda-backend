const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const generarToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existe = await User.findOne({ where: { email } });
    if (existe) return res.status(400).json({ message: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10); // 🔹 Encriptar contraseña
    const user = await User.create({ name, email, password: hashedPassword, role: 'cliente' });

    const token = generarToken(user.id, user.role);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = generarToken(user.id, user.role);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role'] });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};
