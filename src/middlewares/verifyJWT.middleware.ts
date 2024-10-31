import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestUserIDDTO } from "../users/user.types";
import { APIErrors } from "../utils/apiErrors";

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token =
    req.cookies?.accessToken?.replace("Bearers", "") ||
    req?.header("authorization")?.replace("Bearer", "");

  if (!token) {
    throw new APIErrors(401, "Unauthorized Access");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

  (req as RequestUserIDDTO).userID = (decoded as any)?.id;
  next();
}
