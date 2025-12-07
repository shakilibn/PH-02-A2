import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const checkAuth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized!");
    }

    const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

    if (!roles.includes(decoded.role)) {
      throw new Error("Unauthorized");
    }

    req.user = decoded;

    next();
  };
};

export default checkAuth;
