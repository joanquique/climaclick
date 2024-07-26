const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Usa el puerto definido en la variable de entorno o el 3000 por defecto

const axios = require('axios');

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// Ruta principal para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Ejemplo de uso de Axios
app.get('/data', async (req, res) => {
  try {
    const response = await axios.get('https://api.example.com/data');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
