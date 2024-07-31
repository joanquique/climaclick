// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payments');

// Middleware
app.use(bodyParser.json());

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Rutas de pagos
app.use('/api', paymentRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
