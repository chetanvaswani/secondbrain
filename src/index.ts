import express from "express";
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { UserRouter } from "./routes/UserRoutes";
dotenv.config();

const PORT = process.env.PORT || 6001

const app = express();
app.use(express.json())

const prisma = new PrismaClient();

app.use('/api/v1/', UserRouter)

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})