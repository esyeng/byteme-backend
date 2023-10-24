import axios from 'axios';
import { systemRoles } from './content/system_roles';
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

import { headers } from './server';

export const chatGPT = async (body: any) => {
    const text = body.body.text;
    const role = body.body.role;
    const {sass} = systemRoles;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {role: sass.role, content: sass.message},
          {role: `${role}`, content: `${text}`},
        ],
      },
      {headers},
    );
    console.log("Response:", response);
    if (!response || !response.data || !response.data.choices) {
      console.log("No response from GPT");
      return new Error('An error occurred while processing your request');
    } else {
      const chatGptResponse = response.data.choices[0].message.content;
      console.log("GPT Response:", chatGptResponse);
      return {message: chatGptResponse};
    }
}

