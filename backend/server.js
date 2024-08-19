import express from "express"
import cors from "cors"
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

let publicKey;
let privateKey;

if (process.env.MODE === 'production') {
  publicKey = process.env.PROD_PUBLIC_KEY;
  privateKey = process.env.PROD_PRIVATE_KEY;
} else if (process.env.MODE === 'test') {
  publicKey = process.env.TEST_PUBLIC_KEY;
  privateKey = process.env.TEST_PRIVATE_KEY;
}

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 
  privateKey 
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Necesario para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../')));

// Ruta principal para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Fetch hacia Mercado Pago
app.post("/create_preference", async (req, res) => {
    try {
        const body = {
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [
                    {
                      id: "bank_transfer"
                    }
                  ],
                installments: 12,
            },
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "MXN",
                },
            ],
            back_urls: {
                success: "http://localhost:3000/resumen_compra.html",
                failure: "http://localhost:3000/index.html",
                pending: "http://localhost:3000/index.html",
            },
            auto_return: "approved",
        };

        const preference = new Preference (client);
        const result = await preference.create({body});
          res.json({
              id: result.id,
          });
    } catch(error){
          console.log(error);
          res.status(500).json({
              error: "Error al crear la preferencia :("
          })

    }
})

// Fetch hacia Perfit
const perfitApiKey = process.env.PERFIT_API_KEY;
console.log(perfitApiKey);

app.post('/api/subscribe', async (req, res) => {
    try {
        // Enviar datos al API de Perfit
        const response = await fetch('https://api.myperfit.com/v2/instagram5o/contacts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${perfitApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        // Procesar la respuesta de Perfit
        const data = await response.json();

        if (response.ok) {
            res.status(200).json(data); // Responder al cliente con los datos de Perfit
            
        } else {
            res.status(response.status).json(data); // Responder con el error
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al suscribirse' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Enviar public_key al cliente
app.get('/get_public_key', (req, res) => {
  const publicKey = process.env.MODE === 'production' ? process.env.PROD_PUBLIC_KEY : process.env.TEST_PUBLIC_KEY;
  res.json({ publicKey });
});