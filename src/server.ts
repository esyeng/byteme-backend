/**
 * @file This file contains the server configuration and routes for Elysia HTTP server.
 * @summary The server listens on a specified port and hostname, and handles GET and POST requests to various endpoints.
 * @description The server uses the Elysia framework, which provides error handling, CORS, and Swagger documentation.
 * The server also uses the OpenAI API to generate responses to user input, using the `callByteMe` and `callGPT4` methods.
 * The server exports the `openaiApiKey` and `headers` constants, which are used to authenticate with the OpenAI API.
 * The server exports a default entry function, which returns a message when the root endpoint is accessed.
 */
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { callByteMe, callGPT4, cleanJson } from "./methods";
import { auth } from "./auth";

export const openaiApiKey = process.env.OPENAI_API_KEY;
export const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${openaiApiKey}`,
};

console.log(`🦊 Before server init`);

/**
 *
 * @function app Elysia server instance
 * @method defaultEntry is a method that returns a message when the root endpoint is accessed.
 * @method callByteMe is a method that uses the OpenAI API to generate a response to a given input using the byteme_default system message.
 * @method callGPT4 is a method that uses the OpenAI API to generate a response to a given input
 */


const app = new Elysia()
  .onError(({ code, error }) => {
    console.log(`Elysia Server Error -> ${code}: ${error}`);
    return new Response(error.toString());
  })
  .get("/", () => "hello elysia.")
  .group("/api", app =>
    app
      .get("/", () => defaultEntry)
      .post("/byteme", async req => {
        console.log("byteme function called");
        const response = await callByteMe(req);
        return { success: true, response };
      })
      .post("/gpt4", async req => {
        console.log("gpt4 function called");
        const response = await callGPT4(req);
        return { success: true, response };
      })
      .post("/clean", async req => {
        console.log("clean function called");
        const resp = cleanJson(req?.body);
        return { success: true, response: resp };
      })
      .get("/test", async req => {
        console.log("test function called");
        const message = "Test get request!";
        return { success: true, response: message };
      })
  )
  .use(cors())
  .use(swagger())

  .listen({
    port: process.env.PORT || 8080,
    hostname: process.env.HOST || "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname} on port ${app.server?.port}...`
);

const defaultEntry = () => {
  console.log("defaultEntry function called");
  return { message: `Hello from the one! Bun is fun.` };
};
