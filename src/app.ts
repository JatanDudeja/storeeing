import express, { Express, Request, Response } from "express";
import userRouter from "./users/user.routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1/users", userRouter);

export default app;
