import axios from "axios";
import sys from "../.sys";
import { accessSecret } from "./.secret";

const secret = await accessSecret();

const byteMeDefualt = secret
    ?
    secret
    : process.env.BYTEME_DEFAULT
        ? process.env.BYTEME_DEFAULT
        : sys.messages["byteme_default"];
/**
 * Contains server methods to be called in server.
 */
import { headers } from "./server";

interface Chat {
    role: string;
    content: string;
}

/**
 * @method callByteMe is a method that uses the OpenAI API to generate a response to a given input
 * using the byteme_default system message.
 * @param req - Request object with input & role to be used to generate a chatgpt response. Expect role: sring; message: string;
 * @returns A response object with the generated response.
 */
// The incoming messages are an array of chat objects with a message and from tag

export const byteMe = async (req: any) => {
    const { messages, id, temperature, model } = req?.body;
    const byteme = JSON.parse(JSON.stringify(byteMeDefualt));
    if (!messages || messages.length === 0) {
        console.log("No messages received");
        return new Error("No messages received");
    }
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: model,
                messages: [{ role: byteme.role, content: byteme.message }, ...messages],
                temperature: temperature
            },
            { headers }
        );
        if (!response || !response.data || !response.data.choices) {
            console.log("No response from GPT");
            return new Error("An error occurred while processing your request");
        } else {
            const gptResponse = response.data.choices[0].message.content;
            return { message: gptResponse };
        }
    } catch (error) {
        console.log("Error:", error);
        return { message: error };
    }
};




