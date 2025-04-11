// Servidor Express para generar link de pago con PayPhone (modo prueba)

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========================
// CREDENCIALES DE PRUEBA
// ========================
const TOKEN = "XiGQeljRtH7hZy7-M5jcZVVmMN4JlzQjJEEO_lv0-KOGuLf4FfpG8IiZX2soO5-neOqZbnaiTX6xxcKJFOWcaYFPH3Li7eKg7Yq5yI5f0Hg_hFF4EFpm4QPFHatQpeD2LCnaCoT6d5z5PuqPsRjhT_d2h6ynSMKuCMkU09J2kGKQU5Pi8RVtODWT9qMf-f6Hah4Xy_DpAbPfIfREUkYNMlfwNeQ--4jTLQHCu5OIjXr4xAF8kOzQ5Q0v0tFKN3W2ueyubGgjVOWgfQyDD2cYzRIIvTuRvmjGrZlUNd0HWkevF5y3JFmCQ9fm707zwWBwVa0_rs9U2L3nriudJalomVopm2c";
const STORE_ID = "b3bbe8bc-08f9-4b44-923d-78822d222579";

// ========================
// RUTA PARA CREAR LINK
// ========================
app.post("/crear-link-payphone", async (req, res) => {
  const monto = parseFloat(req.body.monto) || 0;
  const pedido = req.body.pedido || "0000";

  try {
    const response = await axios.post(
      "https://pay.payphonetodoesposible.com/api/button/Prepare",
      {
        amount: Math.round(monto * 100), // centavos
        amountWithoutTax: Math.round(monto * 100),
        amountWithTax: 0,
        tax: 0,
        currency: "USD",
        clientTransactionId: pedido,
        storeId: STORE_ID,
        reference: `Pedido #${pedido}`,
        responseUrl: "https://ggtoysec.com/pages/gracias-final",
        cancellationUrl: "https://ggtoysec.com/pages/gracias-final"
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.redirect(response.data.paymentUrl);
  } catch (error) {
    console.error("Error creando link PayPhone:", error?.response?.data || error.message);
    res.status(500).send("Ocurrió un error al generar el link de pago.");
  }
});

// ========================
app.listen(3000, () => {
  console.log("Servidor funcionando en puerto 3000");
});
