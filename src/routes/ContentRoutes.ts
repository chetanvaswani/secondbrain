import { Router } from "express";
import { contentSchema, contentInterface } from "../types/schema";
import { PrismaClient } from "@prisma/client";

const ContentRouter = Router();
const client = new PrismaClient();

ContentRouter.get("/", async (req, res, next) => {
    const userId = req.userId;

    const contents = await client.content.findMany({
        where:{
            userId: userId
        }
    })

    if(!contents){
        res.status(411).json({
            success: false,
            data: "No items to show"
        })
    }

    res.status(200).json({
        success: true,
        data: contents
    })
})

ContentRouter.post("/", async (req, res, next) => {
    const userId = req.userId;

    const {success, data, error} = contentSchema.safeParse(req.body);
    if (!success){
        res.status(411).json({
            success: false,
            data: error
        })
        return
    }

    const content : contentInterface = req.body;
    const contentCreated = await client.content.create({
        data: {
            title: content.title,
            type: content.type,
            userId: userId,
            link: content.link,
        }
    })
    content.tags.forEach(async (tag) => {
        await client.tag.create({
            data: {
                title: tag,
                contentId: contentCreated.id
            }
        })
    })

    res.status(200).json({
        success: true,
        data: "content added successfully."
    })
})

ContentRouter.put("/", (req, res, next) => {

})

ContentRouter.delete("/", (req, res, next) => {

})

export default ContentRouter