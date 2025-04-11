const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const STORE_ID = process.env.STORE_ID;

app.post("/crear-link-payphone", async (req, res) => {
  const monto = parseFloat(req.body.monto) || 0;
  const pedido = req.body.pedido || "0000";

  try {
    const response = await axios.post("https://pay.payphonetodoesposible.com/api/button/Prepare", {
      amount: Math.round(monto * 100),
      amountWithoutTax: Math.round(monto * 100),
      amountWithTax: 0,
      currency: "USD",
      clientTransactionId: pedido,
      storeId: STORE_ID,
      responseUrl: "https://ggtoysec.com/pages/gracias-final",
      cancellationUrl: "https://ggtoysec.com/pages/gracias-final",
      reference: `Pedido ${pedido}`,
    }, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error creando link PayPhone:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al generar el link de pago" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
