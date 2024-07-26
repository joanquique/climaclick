const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Ruta principal para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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
