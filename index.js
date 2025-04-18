const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post("/crear-link-payphone", async (req, res) => {
  const monto = parseFloat(req.body.monto) || 0; // 🔧 Nos aseguramos que sea número válido
  const pedido = req.body.pedido || "0000";

  try {
    const respuesta = await axios.post(
      "https://pay.payphonetodoesposible.com/api/button/Prepare",
     {
  amount: Math.round(monto * 100),
  amountWithoutTax: Math.round(monto * 100),
  amountWithTax: 0,
  tax: 0,
  currency: "USD",
  clientTransactionId: pedido,
  storeId: process.env.STORE_ID,
  reference: `Pedido #${pedido}`,
  responseUrl: "https://ggtoysec.com/pages/gracias-final",
  cancelUrl: "https://ggtoysec.com/pages/gracias-final"
},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.TOKEN}`,
          "StoreId": process.env.STORE_ID,
        },
      }
    );

    res.json(respuesta.data);
  } catch (error) {
    console.error("Error creando link PayPhone:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al generar el link de pago" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
