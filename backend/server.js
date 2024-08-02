const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const mercadopago = require('mercadopago');
const { MercadoPagoConfig, Preference } = mercadopago;

const client = new MercadoPagoConfig({
  accessToken: 'TEST-3105584100759399-073019-82f63418d8f4c2fc5172aabe0ebdbb4a-1855750645'
});

const preference = new Preference(client);

preference.create({
  body: {
    items: [
      {
        title: 'Mi producto',
        quantity: 1,
        unit_price: 85,
        currency_id: 'MXN' // Add currency ID
      }
    ],
    payer: {
      email: 'payer@example.com' // Add payer email
    }
  }
})
.then((response) => {
  console.log(response);
  if (response.body) {
    const preferenceId = response.body.id;
    console.log(`Preferencia creada con ID: ${preferenceId}`);
  } else {
    console.log('Error creating preference:', response);
  }
})
.catch((error) => {
  console.log('Error creating preference:', error);
});

// Middleware
app.use(bodyParser.json());

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname, '..')));

// Ruta principal para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});