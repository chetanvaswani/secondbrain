import express from "express";
import { PrismaClient } from '@prisma/client';
import { userSchema, userInterface } from "../types/schema";
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

export const UserRouter = express.Router()
const prisma = new PrismaClient();
const secret: string = process.env.SECRET!;

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

    const hash = await bcrypt.hash(user.password, 1)

    const createUser = await prisma.users.create({ data: {
        username: user.username,
        password: hash
    } })
    // const token = jwt.sign({
    //     id: createUser.id,
    //     username: createUser.username,
    //     createdAT: Date.now()
    // }, secret)
    // console.log(token)
    // console.log(jwt.decode(token))
    res.status(200).json({
        success: true,
        msg: "user created successfully!"
    })
})