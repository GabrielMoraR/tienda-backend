require('dotenv').config();
const { sequelize, Product } = require('./models');

(async () => {
  try {
    // Conectar
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');

    // Sincronizar (crear tablas si no existen)
    await sequelize.sync({ alter: true });

    /* Insertar productos de prueba
    await Product.bulkCreate([
      { name: 'Laptop Gamer', price: 18000, stock: 5, description: 'Laptop potente para juegos.' },
      { name: 'Mouse Inalámbrico', price: 350, stock: 50, description: 'Mouse ergonómico y cómodo.' }
    ]);*/

    console.log('✅ Productos insertados.');

    // Consultar productos
    const products = await Product.findAll();
    console.log('📦 Productos en la base de datos:');
    console.table(products.map(p => p.toJSON()));

    await sequelize.close();
    console.log('🔌 Conexión cerrada.');
  } catch (err) {
    console.error('❌ Error en la prueba:', err);
  }
})();
