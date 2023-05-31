import { Router, Response, Request } from "express";
import { likeWord, dislikeWord } from "../controllers/likes";



const likesRouter: Router = Router()



likesRouter.post("/", (req: Request, res: Response) => {
   
})


likesRouter.post("/like/:wordId", (req: Request, res: Response) => {
    likeWord(req, res);
})

likesRouter.post("/dislike/:wordId", (req: Request, res: Response) => {
    dislikeWord(req, res);
})


export default likesRouter;