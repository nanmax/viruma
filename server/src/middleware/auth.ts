import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";

export const authenticateToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    const user = await UserModel.getUserById(decoded.userId);
    if (!user) {
      return res.sendStatus(403).json({ message: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403).json({ message: "Invalid access token" });
  }
};

export const requireAdmin = (req:any,res:Response,next:NextFunction)=>{
    if(req.user?.role !== 'admin'){
        return res.status(403).json({message:'Admin access required'});
    }
    next();
}