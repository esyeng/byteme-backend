import axios from "axios";
import sys from "../.sys";
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

export const callByteMe = async (req: any) => {
	const { role, message } = req?.body || "";
	const byteme = sys.messages["byteme_default"];
	if (!role || !message) {
		console.log("No message or role provided");
		return new Error("No text or role provided");
	}
	try {
		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: "gpt-4",
				messages: [
					{ role: byteme.role, content: byteme.message },
					{ role: `${role}`, content: `${message}` },
				],
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

/**
 * @method callGPT4
 * Calls the GPT-4 model to generate a response based on the given messages.
 * @param req - The request parameters containing the message keys to include in the GPT-4 model input.
 * @returns An object containing the generated response message.
 * @throws An error if there was a problem processing the request.
 */
/**

 *
 * @returns {Chat[]} An array of messages.
 */
const _stackInstructions = (msgs: string[]): Chat[] => {
	const messages: Chat[] = [];
    console.log("started stacking instructions")
	for (let i = 0; i < msgs.length; i++) {
		let msg = msgs[i];
        console.log("msg var", msg)
		if (sys.messages[msg]) {
			messages.push({
				role: sys.messages[msg].role,
				content: sys.messages[msg].message,
			});
		}
	}
    console.log(messages)
	return messages;
};

export const callGPT4 = async (req: any) => {
	const { role, message } = req?.body || "";
    console.log("role and message", role + " " + message)
	const { msgKeys } = req?.body || [];
    console.log("message keys", msgKeys)
    let messages: Chat[] = [];
    if (msgKeys.length === 0) {
        messages.push({
            role: role,
            content: message
        });
    } else {
        messages = _stackInstructions(msgKeys).concat([{role: role, content: message}]);
    }

	try {
		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: "gpt-4",
				messages: messages,
			},
			{ headers }
		);
		if (!response || !response.data || !response.data.choices) {
			console.log("No response from GPT");
			throw new Error("An error occurred while processing your request");
		} else {
			const chatGptResponse = response.data.choices[0].message.content;
			return { message: chatGptResponse };
		}
	} catch (error) {
		return { message: error };
	}
};

export const cleanJson = (data: any) => JSON.stringify(data).replace(/[\\r\\n\\t ]+/g, ' ')
