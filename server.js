const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi API OpenAI
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY || "sk-25xADe4_IqUO2lEAotI3lor-oeDIeokcuy6RmLp4iGR_5ND67JPDOXa9rinyJ9ZW0G-ajSvODFT3BlbkFJgCSNIJbws7XTUV4gDAOchgedr1dQKrE_zJJtBO3aUNhhcS_nNbpIrzV2pToE7NDKQ6hQqq474A", // Ganti dengan API key OpenAI Anda
  })
);

// Endpoint untuk chatbot
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  }

  try {
    let responseMessage;

    // Periksa apakah pertanyaan memerlukan data real-time
    if (message.toLowerCase().includes("tahun") || message.toLowerCase().includes("tanggal")) {
      // Memberikan informasi waktu sesuai tahun 2025
      const currentDate = new Date();
      currentDate.setFullYear(2025); // Menetapkan tahun 2025
      responseMessage = `Saat ini adalah tahun 2025, tanggal ${currentDate.toLocaleDateString()} dan waktu sekarang ${currentDate.toLocaleTimeString()}.`;
    } else if (message.toLowerCase().includes("cuaca")) {
      // Ambil data cuaca real-time (gunakan OpenWeatherMap API)
      const city = "Jakarta"; // Ganti dengan nama kota
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY || "8744f80a8a0541238fc175433250601"}&units=metric`
      );

      const weather = weatherResponse.data;
      responseMessage = `Cuaca di ${weather.name}: ${weather.weather[0].description}, suhu ${weather.main.temp}°C, kecepatan angin ${weather.wind.speed} m/s. (Tahun 2025)`;
    } else {
      // Gunakan OpenAI untuk menjawab pertanyaan umum
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });

      responseMessage = completion.data.choices[0].message.content;
    }

    res.json({ response: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses permintaan." });
  }
});

// Tambahkan endpoint untuk tes server
app.get("/", (req, res) => {
  res.send("Chatbot AI dengan data real-time berjalan!");
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
