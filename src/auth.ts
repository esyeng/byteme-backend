import { lucia } from "lucia";
import { elysia } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
export const auth = lucia({
  adapter: prisma(client, {
    user: "user",
    key: "key",
    session: "session",
  }),
  env: "DEV",
  middleware: elysia()
})

export type Auth = typeof auth;
