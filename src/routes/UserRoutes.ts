import express from "express";
import { PrismaClient } from '@prisma/client';
import { userSchema, userInterface } from "../types/schema";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const UserRouter = express.Router()
const prisma = new PrismaClient();

UserRouter.post('/signup', async (req, res) => {
    const response = userSchema.safeParse(req.body)
    if (!response.success){
        res.send(response)
        return
    }
    const user : userInterface = req.body

    const userExist =  await prisma.users.findFirst({
        where: {
            username: user.username
        }
    })
    if(userExist){
        res.status(403).json({success: false, data: "user already exists with this username"})
        return
    }

    const createUser = await prisma.users.create({ data: user })
    res.send(createUser)
    const token = jwt.sign({
        createUser
    }, 'secret')
})