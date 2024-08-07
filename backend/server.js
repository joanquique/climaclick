import express from "express"
import cors from "cors"
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 
  'TEST-3105584100759399-073019-82f63418d8f4c2fc5172aabe0ebdbb4a-1855750645' 
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
                failure: "http://localhost:3000/resumen_compra.html",
                pending: "http://localhost:3000/resumen_compra.html",
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
