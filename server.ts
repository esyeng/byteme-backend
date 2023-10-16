const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api", express.static(import.meta.dir + '/api'));

const openaiApiKey = process.env.OPENAI_API_KEY;
const BASE_URL = process.env.BASE_URL;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${openaiApiKey}`,
};

interface ChatRequest {
  body: {
    text: string;
    role?: string;
    temperature?: number;
    max_tokens?: number;
  };
 }

app.post("/api/chat", async (req: ChatRequest, res: any) => {
  try {
    const input: string = req.body ? req.body.text ? req.body.text : "nothing substantial": "eh";
    const role: string = req.body ? req.body.role ? req.body.role: "user": "user";
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: 'You are a sassy assistant.'},
          {role: `${role}`, content: `${input}`},
        ],
      },
      {headers},
    );
    const chatGptResponse = response.data.choices[0].message.content;
    console.log("GPT Response:", chatGptResponse);
    res.status(200).json({ message: chatGptResponse });

  } catch (err) {
    console.log('Error: ' + err);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
