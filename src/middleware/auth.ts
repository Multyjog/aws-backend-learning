import { Request } from "express";
import * as jwt from "jsonwebtoken";

export interface ITokenData {
  id: String;
  email: String;
}

const config = process.env;

export const getTokenData = (req: Request): ITokenData => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) return { id: null, email: null };
  const decoded = jwt.verify(token, config.TOKEN_KEY) as ITokenData;
  return decoded;
};

export const verifyToken = (req, res, next) => {
  const tokenData = getTokenData(req);
  // const token =
  //   req.body.token || req.query.token || req.headers["x-access-token"];

  if (!tokenData.id) {
    return res.status(403).send("A token is required for authentication");
  }
  return next();
};
