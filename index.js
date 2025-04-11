const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post("/crear-link-payphone", async (req, res) => {
  const { monto, pedido } = req.body;

  try {
    const respuesta = await axios.post(
      "https://sandbox.api.payphone.ec/api/button/Prepare",
      {
        amount: Math.round(monto * 100),
        amountWithoutTax: 0,
        amountWithTax: Math.round(monto * 100),
        tax: 0,
        clientTransactionId: pedido,
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
