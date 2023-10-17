import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors';
import { chatGPT } from './methods';

const port: number = parseInt(process.env.PORT || '8080');
const hostname: string = process.env.BASE_HOST ? process.env.BASE_HOST : 'localhost';

console.log(`🦊 initial values for port: ${port} and hostname: ${hostname}`);

const app = new Elysia()
  .onError(({ code, error }) => {
    console.log(`Elysia Server Error -> ${code}: ${error}`);
    return new Response(error.toString());
  })
  .use(cors())
  .use(swagger())
  .listen({
    port: port,
    hostname: hostname
})

console.log(`🦊 Elysia is running at ${app.server?.hostname} on port ${app.server?.port}...`);

const defaultEntry = async (req: any, res: any) => {
  try {
    res.json({message: `Hello from the one! Bun is fun.`});
  } catch (err) {
    console.log('Error message: ' + err);
    res.error(err);
  }
}

app
  .group("/v1", app => app)
  .get("/", () => defaultEntry)
    .group("/api", app => app
      .post("/chat", () => chatGPT));

