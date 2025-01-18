import { Router } from "express";
import { contentSchema, contentInterface } from "../types/schema";
import { PrismaClient } from "@prisma/client";

const ContentRouter = Router();
const client = new PrismaClient();

ContentRouter.get("/", (req, res, next) => {
    res.send("hello world")
})

ContentRouter.post("/", async (req, res, next) => {
    const userId = req.userId;

    const response = contentSchema.safeParse(req.body);
    if (!response.success){
        res.send(response)
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

ContentRouter.delete("/", (req, res, next) => {

})

export default ContentRouter