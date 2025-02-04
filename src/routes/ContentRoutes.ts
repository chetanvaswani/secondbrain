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
        },
        include: {
            tags: true 
        }
    })

    if(!contents){
        res.status(404).json({
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
            user: { connect: { id: userId } },
            link: content.link,
            tags: {
                createMany: {
                    data : [
                        ...content.tags.map((title) => {
                            return {
                                title: title
                            }
                        })
                    ]
                }
            }
        }
    })

    res.status(200).json({
        success: true,
        data: contentCreated
    })
})

ContentRouter.put("/", async (req, res, next) => {
    const userId = req.userId;
    const contentId = req.body.contentId;

    if (!contentId) {
        res.status(400).json({
            message: "Content ID is required for updates",
        });
        return;
    }

    const {success, data, error} = contentSchema.safeParse(req.body);
    if (!success){
        res.status(411).json({
            success: false,
            data: error
        })
        return
    }
    const content : contentInterface = req.body;
    const updatedContent = await client.content.update({
        where:{
            id: contentId,
            userId: userId
        },
        data: {
            title: content.title,
            type: content.type,
            userId: userId,
            link: content.link,
            tags: {
                deleteMany: {
                    contentId: contentId
                },
                createMany: {
                    data: [
                        ...content.tags.map((title) => {
                            return {
                                title: title
                            }
                        })
                    ]
                }
            }
        },
        include:{
            tags: true
        }
    })

    if (!updatedContent) {
        res.status(404).json({
            message: "Content not found or you're not authorized to update it",
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: updatedContent
    })
})

ContentRouter.delete("/", async (req, res, next) => {

})

export default ContentRouter