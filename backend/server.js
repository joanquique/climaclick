import express from "express"
import cors from "cors"
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';

dotenv.config();

let publicKey = process.env.PROD_PUBLIC_KEY;
let privateKey = process.env.PROD_PRIVATE_KEY;

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
                success: "http://89.116.212.196:3000/resumen_compra.html",
                failure: "http://89.116.212.196:3000/index.html",
                pending: "http://89.116.212.196:3000/index.html",
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

// Configurar el transporte de correo
// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     auth: {
//         user: 'correo@gmail.com', 
//         pass: 'contraseña' 
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

app.post('/api/subscribe', async (req, res) => {
    try {
        // const { email, name, phone } = req.body;
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

        // // Configurar el contenido del correo para el vendedor
        // const mailOptionsToSeller = {
        //     from: 'correo@gmail.com',
        //     to: 'correo@gmail.com', // Reemplaza con tu correo de ventas
        //     subject: 'Resumen de Compra - Venta',
        //     text: `Nuevo resumen de compra:\n\nEmail: ${email}\nNombre: ${name}\nTeléfono: ${phone}`
        // };

        // // Configurar el contenido del correo para el comprador
        // const mailOptionsToBuyer = {
        //     from: 'correo@gmail.com',
        //     to: email, // El correo del comprador
        //     subject: 'Confirmación de Compra',
        //     text: `Gracias por tu compra, ${name}!\n\nTu resumen de compra es:\n\nNombre: ${name}\nTeléfono: ${phone}`
        // };

        // // Enviar correos
        // await Promise.all([
        //     transporter.sendMail(mailOptionsToSeller),
        //     transporter.sendMail(mailOptionsToBuyer)
        // ]);

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

// Fetch hacia Skydropx
const skydropxApiKey = process.env.SKYDROPX_API_KEY;

app.post('/api/shipping/rates', async (req, res) => {
  const { nombre, apellido, correo, telefono, address } = req.body;
  try {
      const response = await fetch('https://api.skydropx.com/v1/rates', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${skydropxApiKey}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              origin: { 
                  address: 'Schumann',
                  number: 202,
                  postal_code: '07870',
                  neighborhood: 'Vallejo',
                  city: 'Gustavo A. Madero',
                  state: 'CDMX',
              }, 
              destination: {
                  address: address.calle,
                  number: address.num_ext,
                  complement: address.num_int,
                  postal_code: address.cp,
                  neighborhood: address.colonia,
                  city: address.city,
                  state: address.state,
                  reference: address.referencia
              },
          })
      });

      const data = await response.json();

      if (response.ok) {
          res.status(200).json(data);
      } else {
          res.status(response.status).json(data);
      }
  } catch (error) {
      console.error('Error fetching shipping rates:', error);
      res.status(500).json({ error: 'Error fetching shipping rates' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Enviar public_key al cliente
app.get('/get_public_key', (req, res) => {
//   const publicKey = process.env.MODE === 'production' ? process.env.PROD_PUBLIC_KEY : process.env.TEST_PUBLIC_KEY;
  const publicKey = process.env.PROD_PUBLIC_KEY;
  res.json({ publicKey });
});