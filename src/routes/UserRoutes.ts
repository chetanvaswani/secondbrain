import express from "express";
import { PrismaClient } from '@prisma/client';
import { userSchema, userInterface } from "../types/schema";
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import "express-async-errors";
dotenv.config();

export const UserRouter = express.Router()
const prisma = new PrismaClient();
const secret: string = process.env.SECRET!;
const saltrounds = 3;

UserRouter.post('/signup', async (req, res, next) => {
    const response = userSchema.safeParse(req.body)
    if (!response.success){
        res.send(response)
        return
    }
    const user : userInterface = req.body;

    const userExist =  await prisma.users.findFirst({
        where: {
            username: user.username
        }
    })
    if(userExist){
        res.status(403).json({success: false, data: "user already exists with this username"})
        return
    }

    const hash = await bcrypt.hash(user.password, saltrounds);
    console.log(hash)

    await prisma.users.create({ data: {
        username: user.username,
        password: hash
    } })

    res.status(200).json({
        success: true,
        msg: "user created successfully!"
    })
})


UserRouter.post('/signin', async (req, res, next) => {
    const response = userSchema.safeParse(req.body)
    if (!response.success){
        res.send(response)
        return
    }
    const user : userInterface = req.body;
    // finding user with the same email
    const userFound =  await prisma.users.findFirst({
        where: {
            username: user.username,
        }
    })
    if(!userFound){
        res.status(403).json({success: false, data: "invalid credentials"})
        return
    }
    // comparing passwords
    const result = await bcrypt.compare( user.password, userFound.password)
    if(!result){
        res.status(403).json({success: false, data: "invalid credentials"})
        return
    }
    // generating jwt
    const token = jwt.sign({
        id: userFound.id,
        username: userFound.username,
        createdAT: Date.now()
    }, secret)
    throw new Error('Whoops!')
    res.status(200).json({
        token: token
    })
})