import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { string } from "zod";

const secret = process.env.SECRET!;

const auth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token: string = authHeader?.split(' ')[1]!;

    const decoded =  jwt.verify(token, secret)
    if (!decoded){
        res.status(403).json({ msg : "Can not verify user. Token rejected." })
    }
    
    // @ts-ignore
    req.userId = decoded.id;
    next();
}

export default auth