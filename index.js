const express = require('express');
const cors = require('cors'); // ✅ nuevo
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors()); // ✅ habilita CORS
app.use(express.json());

app.post('/crear-link-payphone', async (req, res) => {
  const { monto, pedido } = req.body;

  const body = {
    amount: Math.round(monto * 100), // PayPhone usa centavos
    amountWithoutTax: Math.round(monto * 100),
    currency: "USD",
    clientTransactionId: pedido,
    responseUrl: "https://payphone-server.fly.dev/confirmacion"
  };

  try {
    const response = await axios.post('https://pay.payphonetodo.com/api/button/Prepare', body, {
      headers: {
        Authorization: 'Bearer TU_TOKEN_AQUI',
        'Content-Type': 'application/json',
        'StoreId': 'TU_STORE_ID_AQUI'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: 'Error al generar el link de pago' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
