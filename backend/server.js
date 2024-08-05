import express from "express"
import cors from "cors"

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

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Ruta principal para servir el archivo HTML principal
app.get('/', (req, res) => {
  res.send("soy el server :)");
});

app.post("/create_preference", async (req, res) => {
  try {
      const body = {
          items: [
              {
                  title: req.body.title,
                  quantity: Number(req.body.quantity),
                  unit_price: Number(req.body.price),
                  currency_id: "MXN",
              },
          ],
          back_urls: {
              success: "https://github.com/joanquique/climaclick",
              failure: "https://github.com/joanquique/climaclick",
              pending: "https://github.com/joanquique/climaclick",
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
