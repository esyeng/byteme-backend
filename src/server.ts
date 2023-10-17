import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors';
import { chatGPT } from './methods';

export const openaiApiKey = process.env.OPENAI_API_KEY;
export const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${openaiApiKey}`,
};

const app = new Elysia()
  .onError(({ code, error }) => {
    console.log(`Elysia Server Error -> ${code}: ${error}`);
    return new Response(error.toString());
  })
	.get('/', () => 'Hello Elysia')
  .group("/api", app => app
    .get("/", () => defaultEntry)
    .post("/chat", async (body) => {
        console.log("chat function called");
        const response = await chatGPT(body);
        return {success: true, response};
      }))
  .use(cors())
  .use(swagger())
	.listen(8080);

console.log(`🦊 Elysia is running at ${app.server?.hostname} on port ${app.server?.port}...`);

const defaultEntry = () => {
  console.log('defaultEntry function called');
  return {message: `Hello from the one! Bun is fun.`};
}
