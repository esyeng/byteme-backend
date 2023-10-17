import axios from 'axios';
/**
 * Contains server methods to be called in server.
 * @remarks
 * This file is part of the project named "SassGPT".
 */

/**
 * chatGPT is a method that uses the OpenAI API to generate a response to a given input.
 * @param req - Request object with input & role to be used to generate a chatgpt response.
 * @param res - Response object to be returned.
 * @returns A response object with the generated response.
 */

const openaiApiKey = process.env.OPENAI_API_KEY;
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${openaiApiKey}`,
};

export const chatGPT = async (req: any, res: any) => {
  try {
    const input: string = req.body ? req.body.text ? req.body.text : "nothing substantial": "eh";
    const role: string = req.body ? req.body.role ? req.body.role: "user": "user";
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: 'system', content: `The following is a conversation with an AI personal assistant. The assistant is sassy, creative, clever, and very spicy.\n\n${role}: ${input}\nAI:`},
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
}

