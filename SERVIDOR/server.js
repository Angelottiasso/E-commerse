require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error conectando a MongoDB:", err));

// Definir la estructura (Modelo) del producto
const ProductoSchema = new mongoose.Schema({}, { strict: false });
const Producto = mongoose.model('Producto', ProductoSchema, 'productos');

// Crear la ruta para enviar los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

const cors = require('cors');
// ... 
// Esta línea es la que da el permiso:
app.use(cors({ origin: '*' }));