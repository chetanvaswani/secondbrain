import { PrismaClient } from "@prisma/client";
import express from "express";
import auth from "../middlewear/authentication";
import randomstring from 'randomstring';

const client = new PrismaClient();
const LinkRouter = express.Router()

LinkRouter.get('/:shareLink', async (req, res, next) => {
    const link = req.params.shareLink

    if(!link){
        res.status(404).json({
            success: false,
            data: "Not a valid link"
        })
        return
    }

    const user = await client.link.findFirst({
        where: {
            hash: link
        },
        select: {
            userId: true
        }
    })

    if (!user){
        res.status(404).json({
            success: false,
            data: "Not a valid link"
        })
        return
    }

    const content = await client.content.findMany({
        where:{
            userId: user?.userId
        },
        include: {
            tags: true
        }
    })

    if (!content){
        res.status(404).json({
            success: false,
            data: "Content Not Found"
        })
        return
    }

    res.status(200).json({
        success: true,
        data: content
    })
})

LinkRouter.post('/share', auth, async (req, res, next) => {
    const userId = req.userId
    const { share } = req.body

    if (!share){
        res.status(411).json({
            success: false,
            data: "Invalid Request!"
        })
        return
    }

    const linkCreated = await client.link.findFirst({
        where: {
            userId: userId,
        },
        select: {
            hash: true
        }
    })

    if (linkCreated){
        res.status(200).json({
            success: true,
            data: {
                link: linkCreated.hash
            }
        })
        return
    }

    const hash = randomstring.generate();
    const newLink = await client.link.create({
        data: {
            userId: userId,
            hash: hash
        },
        select: {
            hash: true
        }
    })

    if (!newLink) {
         res.status(411).json({
            success: false,
            data: "You are not authorised to share content."
         })
         return
    }

    res.status(200).json({
        success: true,
        data:{
            link: newLink.hash
        }
    })
})

export default LinkRouter