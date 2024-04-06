import axios from "axios";
import Anthropic from "@anthropic-ai/sdk";
import { getAdaTypeString, User, defaultAda_old, byteMeDefualt } from './.stringKeeper';


// import { accessSecret } from "./.secret";

// const secret = await accessSecret();
const secret = null;




// const byteMeDefualt = secret
// ?
// secret
// : process.env.BYTEME_DEFAULT
//     ? process.env.BYTEME_DEFAULT
//     : sys.messages["byteme_default"];

/**
 * Contains server methods to be called in server.
 */
import { headers } from "./server";

interface Chat {
    role: string;
    content: string;
}

const anthropic = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"]
});


/**
 * @method
 */
/**
 * Handles the 'ada' request by creating a message using the provided parameters.
 *
 * @param req - The request object containing the following properties:
 *   - messages: An array of messages.
 *   - user: The user object.
 *   - mode: The mode of operation.
 *   - max_tokens: The maximum number of tokens.
 * @returns The response object.
 */
export const ada = async (req: any) => {
    const { messages, user, mode, max_tokens, timestamp } = req?.body
    const max: number | null = max_tokens ? max_tokens : null;
    try {
        const response = createMsg(messages, user, mode, max, timestamp);
        return response;
    } catch (err: any) {
        console.error("Error from within ada function", err);
    }
}

/**
 * Creates a message using the given parameters.
 *
 * @param messages - An array of messages.
 * @param user - The user object.
 * @param mode - The mode string.
 * @param maxTokens - The maximum number of tokens.
 * @returns A promise that resolves to the created message or an error.
 */
const createMsg = async (messages: any[], user: User, mode: string, maxTokens: number | null, timestamp: number | undefined) => {
    const sysMsg = user && mode ? getAdaTypeString(user, mode) : defaultAda_old.content; // TODO: Update getAdaTypeString with weighting logic depending on timestamp recency
    if (!messages || messages.length === 0) {
        console.log("No messages received");
        return new Error("No messages received");
    }
    try {
        console.log(`incoming data: {
            messages: [${messages[messages.length - 1].content}],
            user: ${user ? JSON.stringify(user) : 'user not showin in req log :('},
            mode: ${mode ? mode : 'no mode received'}
            max_tokens: ${maxTokens}
        }`)
        const msg = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            system: sysMsg,
            max_tokens: maxTokens ? maxTokens : 1000,
            temperature: 0.7,
            messages: [...messages]
        })
        if (!msg || !msg.content) {
            console.log("No response from Ada (Claude)");
            return new Error("An error occurred while processing your request, anthropic api");
        } else {
            const adaResponse = msg.content[0].text;
            return { message: adaResponse };
        }
    } catch (err: any) {
        console.error("API Error: could not create message", err)
    }
}

const streamMsg = async (messages: any) => { // unused for now
    const msg = await anthropic.messages.stream({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        temperature: 0,
        messages: [messages]
    }).on('text', (text) => {
        console.log(text);
        return text
    });
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
    // const byteme = JSON.parse(JSON.stringify(byteMeDefualt));
    const byteme = byteMeDefualt

    if (!messages || messages.length === 0) {
        console.log("No messages received");
        return new Error("No messages received");
    }
    try {
        console.log(`incoming data: {
            messages: [${messages[0].content}],
            model: ${model},
            byteme_default: ${byteme.content}
        }`)
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: model,
                messages: [{ role: byteme.role, content: byteme.content }, ...messages],
                temperature: temperature
            },
            { headers }
        )
        if (!response || !response.data || !response.data.choices) {
            console.log("No response from GPT");
            return new Error("An error occurred while processing your request");
        } else {
            const gptResponse = response.data.choices[0].message.content;
            return { message: gptResponse };
        }
    } catch (error: any) {
        console.log("Caught exception:", error?.response?.data);
        return { message: error };
    }
};




/**
 * Claude API res example:
 *
 * {
    "content": [
    {
        "text": "Hi! My name is Claude.",
        "type": "text"
    }
    ],
        "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
        "model": "claude-3-opus-20240229",
        "role": "assistant",
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "type": "message",
        "usage": {
        "input_tokens": 10,
        "output_tokens": 25
    }
}
 */

