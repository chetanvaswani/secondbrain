import { Router } from "express";

const ContentRouter = Router()

ContentRouter.get("/", (req, res, next) => {
    console.log(req.userId)
    res.send("hello world")
})

ContentRouter.post("/", (req, res, next) => {

})

ContentRouter.delete("/", (req, res, next) => {

})

export default ContentRouter