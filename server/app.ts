import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import apiRouter from "./route";
import cookieParser from "cookie-parser";
import { optionalAuthMiddleware } from "./middleware/auth";
import database from "./config/db";


declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}



export const app = express();
app.use(express.json());
app.use(cookieParser());

await database.connect();
app.use(optionalAuthMiddleware);

app.use('/api',apiRouter);

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  }),
);
