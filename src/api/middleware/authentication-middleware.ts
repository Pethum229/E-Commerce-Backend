import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express"; // Ensure Clerk is imported
import UnauthorizedError from "../../domain/errors/unauthorized-error";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req); // Get authentication context from Clerk

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    req.auth = auth; // Attach auth details to request

    // console.log("UserID",req.auth.userId);
    next();
  } catch (error) {
    next(new UnauthorizedError("Authentication failed"));
  }
};
